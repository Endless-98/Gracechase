const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { DynamoDBClient, ScanCommand, PutItemCommand, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const crypto = require('crypto');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// AWS SES Configuration
const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// AWS DynamoDB Configuration
const ddb = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const NEWSLETTER_TABLE = process.env.NEWSLETTER_TABLE;

// Simple CORS allowlist
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: false,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const params = {
      Source: process.env.FROM_EMAIL, // Must be verified in SES
      Destination: {
        ToAddresses: [process.env.TO_EMAIL],
      },
      Message: {
        Subject: {
          Data: `Contact Form: ${name || 'Anonymous'}`,
        },
        Body: {
          Text: {
            Data: `
Name: ${name || 'Not provided'}
Email: ${email || 'Not provided'}

Message:
${message}
            `,
          },
        },
      },
    };

    const command = new SendEmailCommand(params);
    await sesClient.send(command);

    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// --- Newsletter signup endpoint (idempotent upsert + consent logging) ---
const RATE_WINDOW_MS = parseInt(process.env.RATE_WINDOW_MS || '60000', 10); // 60s
const RATE_MAX = parseInt(process.env.RATE_MAX || '10', 10); // 10 req / window / IP
// Inactive retention window: default ~14 months (425 days). Backwards compatible with TTL_PENDING_DAYS.
const TTL_INACTIVE_DAYS = parseInt(process.env.TTL_INACTIVE_DAYS || process.env.TTL_PENDING_DAYS || '425', 10);
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET || '';
const limiter = new Map(); // ip -> { count, resetAt }

function rateLimit(req, res) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || 'unknown';
  const now = Date.now();
  const slot = limiter.get(ip) || { count: 0, resetAt: now + RATE_WINDOW_MS };
  if (now > slot.resetAt) {
    slot.count = 0;
    slot.resetAt = now + RATE_WINDOW_MS;
  }
  slot.count++;
  limiter.set(ip, slot);
  if (slot.count > RATE_MAX) {
    res.status(429).json({ error: 'Too many requests' });
    return true;
  }
  return false;
}

function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

async function verifyTurnstile(token, remoteip) {
  if (!TURNSTILE_SECRET) return { success: true, skipped: true };
  try {
    const form = new URLSearchParams();
    form.append('secret', TURNSTILE_SECRET);
    form.append('response', token || '');
    if (remoteip) form.append('remoteip', remoteip);
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
    });
    const j = await r.json();
    return j;
  } catch (e) {
    return { success: false, error: 'verification_failed' };
  }
}

app.post('/api/newsletter-signup', async (req, res) => {
  try {
    if (!NEWSLETTER_TABLE) return res.status(500).json({ error: 'Server not configured' });
    if (rateLimit(req, res)) return;

    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || '';
    const ua = req.headers['user-agent'] || '';
    const { email, interests, consentTextVersion, referrerPath, turnstileToken } = req.body || {};
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    const human = await verifyTurnstile(turnstileToken, ip);
    if (!human?.success) {
      return res.status(400).json({ error: 'Bot verification failed' });
    }

    const nowIso = new Date().toISOString();
  const ttl = Math.floor(Date.now() / 1000) + (TTL_INACTIVE_DAYS * 24 * 60 * 60);
    const interestsArr = Array.isArray(interests) ? interests.filter(Boolean) : [];

    // Try find existing by scanning on email (no GSI available). Acceptable at low volume.
    const scan = await ddb.send(new ScanCommand({
      TableName: NEWSLETTER_TABLE,
      FilterExpression: '#em = :e',
      ExpressionAttributeNames: { '#em': 'email' },
      ExpressionAttributeValues: { ':e': { S: normalizedEmail } },
      ProjectionExpression: 'id,email,status',
      Limit: 1,
    }));
    const existing = (scan.Items && scan.Items[0]) || null;

    if (!existing) {
      const id = crypto.randomUUID();
      const item = {
        id,
        email: normalizedEmail,
        status: 'pending',
        interests: interestsArr,
        createdAt: nowIso,
        updatedAt: nowIso,
        ttl, // numeric for DynamoDB TTL (seconds since epoch)
        consent: {
          ts: nowIso,
          ip,
          ua,
          referrerPath: referrerPath || '',
          textVersion: consentTextVersion || 'v1',
        },
      };
      await ddb.send(new PutItemCommand({ TableName: NEWSLETTER_TABLE, Item: marshall(item, { removeUndefinedValues: true }) }));
      return res.status(202).json({ ok: true, status: 'pending', id });
    } else {
      const id = existing.id.S;
      // Replace interests (or union if preferred). Ensure ttl present/updated for retention window.
      const values = {
        ':email': { S: normalizedEmail },
        ':updatedAt': { S: nowIso },
        ':interests': { L: interestsArr.map(s => ({ S: s })) },
        ':consent': { M: marshall({ ts: nowIso, ip, ua, referrerPath: referrerPath || '', textVersion: consentTextVersion || 'v1' }) },
      };
      const update = {
        TableName: NEWSLETTER_TABLE,
        Key: { id: { S: id } },
        UpdateExpression: 'SET #email = :email, #updatedAt = :updatedAt, #interests = :interests, #consent = :consent',
        ExpressionAttributeNames: { '#email': 'email', '#updatedAt': 'updatedAt', '#interests': 'interests', '#consent': 'consent' },
        ExpressionAttributeValues: values,
      };
      // Use a second update to set ttl defensively
      await ddb.send(new UpdateItemCommand(update));
      await ddb.send(new UpdateItemCommand({
        TableName: NEWSLETTER_TABLE,
        Key: { id: { S: id } },
        UpdateExpression: 'SET #ttl = :ttl',
        ExpressionAttributeNames: { '#ttl': 'ttl' },
        ExpressionAttributeValues: { ':ttl': { N: String(ttl) } },
      }));
      return res.status(202).json({ ok: true, status: 'pending', id });
    }
  } catch (e) {
    console.error('newsletter-signup error', e);
    return res.status(500).json({ error: 'server_error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
