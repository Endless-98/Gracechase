const crypto = require('crypto');
const { DynamoDBClient, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');

const REGION = process.env.AWS_REGION || 'us-east-1';
const TABLE = process.env.NEWSLETTER_TABLE;
const SECRET = process.env.REDIRECT_TOKEN_SECRET;
const ALLOWED = (process.env.ALLOWED_REDIRECT_HOSTS || '').split(',').map(h => h.trim()).filter(Boolean);
const TTL_DAYS = parseInt(process.env.TTL_EXTENSION_DAYS || '30', 10);

const ddb = new DynamoDBClient({ region: REGION });

function b64urlDecode(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  const pad = s.length % 4 === 2 ? '==' : s.length % 4 === 3 ? '=' : '';
  return Buffer.from(s + pad, 'base64');
}

function verifyToken(token) {
  if (!token || !SECRET) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const body = b64urlDecode(parts[0]);
  const sig = b64urlDecode(parts[1]);
  const expected = crypto.createHmac('sha256', SECRET).update(body).digest();
  if (!crypto.timingSafeEqual(expected, sig)) return null;
  let payload;
  try { payload = JSON.parse(body.toString('utf8')); } catch { return null; }
  if (!payload || !payload.id || typeof payload.exp !== 'number') return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

function isLikelyBot(headers, method) {
  if (method === 'HEAD') return true;
  const ua = (headers['user-agent'] || headers['User-Agent'] || '').toLowerCase();
  if (!ua) return true; // overly conservative; treat missing UA as bot
  const botHints = ['spam', 'scanner', 'bot', 'crawler', 'preview', 'linkexpander', 'fetch', 'monitor'];
  return botHints.some(h => ua.includes(h));
}

function isAllowedTarget(urlStr) {
  try {
    const u = new URL(urlStr);
    if (ALLOWED.length === 0) return true; // allow any if not configured
    return ALLOWED.includes(u.host);
  } catch { return false; }
}

exports.handler = async (event) => {
  try {
    const qs = event.queryStringParameters || {};
    const method = event.requestContext?.http?.method || event.httpMethod || 'GET';

    const token = qs.token;
    const toB64 = qs.to;
    let location = '/';
    if (toB64) {
      try { location = Buffer.from(toB64.replace(/-/g,'+').replace(/_/g,'/'), 'base64').toString('utf8'); } catch {}
    }

    if (!isAllowedTarget(location)) {
      // prevent open redirect; fallback to homepage
      location = 'https://www.gracechase.com/';
    }

    const headers = event.headers || {};
    const payload = verifyToken(token);

    // If valid token and likely a real user, bump TTL
    if (payload && !isLikelyBot(headers, method) && TABLE) {
      const newTtl = Math.floor(Date.now() / 1000) + (TTL_DAYS * 24 * 60 * 60);
      try {
        await ddb.send(new UpdateItemCommand({
          TableName: TABLE,
          Key: { id: { S: payload.id } },
          UpdateExpression: 'REMOVE deletedAt SET ttl = :t',
          ExpressionAttributeValues: {
            ':t': { N: String(newTtl) },
          },
        }));
      } catch (e) {
        console.warn('Failed to bump TTL', e);
      }
    }

    return {
      statusCode: 302,
      headers: {
        Location: location,
        'Cache-Control': 'no-store',
      },
      body: '',
    };
  } catch (e) {
    console.error(e);
    return { statusCode: 302, headers: { Location: 'https://www.gracechase.com/' }, body: '' };
  }
};
