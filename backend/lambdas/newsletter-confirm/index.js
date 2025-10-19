// Newsletter confirmation email Lambda (SES)
//
// Usage:
// - Deploy this file as an AWS Lambda (Node.js 20.x) in us-east-1
// - Set environment variable FROM_EMAIL=contact.gracechase@gmail.com (or a verified domain address)
// - Create a Function URL (Auth: NONE) and configure CORS for your site origin(s)
// - Frontend calls this URL with { email, interests[], subject?, bodyHtml? }

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1';
const FROM_EMAIL = process.env.FROM_EMAIL || 'contact.gracechase@gmail.com';
const DEFAULT_SUBJECT = process.env.SUBJECT_TEMPLATE || 'Thanks for subscribing to Gracechase';
const DEFAULT_HTML =
  process.env.BODY_HTML_TEMPLATE ||
  `<div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#111">
     <p>Hi,</p>
     <p>Thanks for subscribing to Gracechase!</p>
     <p>We will email you about: <strong>{{interests}}</strong>.</p>
     <p>Grace has been chasing you,<br/>— Gracechase</p>
   </div>`;

const ses = new SESClient({ region: REGION });

exports.handler = async (event) => {
  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : (event.body || {});
    const to = body.email;
    if (!to) return response(400, 'Missing email');

    const interests = Array.isArray(body.interests) ? body.interests : [];
    const subject = body.subject || DEFAULT_SUBJECT;
    const htmlTemplate = body.bodyHtml || DEFAULT_HTML;
    const html = htmlTemplate.replace(/\{\{interests\}\}/g, interests.join(', '));

    await ses.send(new SendEmailCommand({
      Source: FROM_EMAIL,
      Destination: { ToAddresses: [to] },
      ReplyToAddresses: [FROM_EMAIL],
      Message: {
        Subject: { Data: subject, Charset: 'UTF-8' },
        Body: { Html: { Data: html, Charset: 'UTF-8' } },
      },
    }));

    return response(200, { ok: true });
  } catch (e) {
    console.error('newsletter-confirm error', e);
    return response(500, { ok: false, error: e?.message || 'Unknown error' });
  }
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      // Adjust CORS as needed for your origins
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  };
}
