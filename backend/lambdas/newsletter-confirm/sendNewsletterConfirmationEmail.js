// sendNewsletterConfirmationEmail.js
//
// Purpose: AWS Lambda handler to send a newsletter confirmation email via Amazon SES.
// Deploy in us-east-1 under the Gracechase account.
//
// Usage:
// - Runtime: Node.js 20.x
// - Env vars:
//   - FROM_EMAIL=contact.gracechase@gmail.com (or a verified domain address)
//   - SUBJECT_TEMPLATE (optional)
//   - BODY_HTML_TEMPLATE (optional; supports {{interests}} token)
// - Create a Function URL (Auth: NONE) and configure CORS for your site origin(s)
// - Frontend calls this URL with JSON body: { email, interests[], subject?, bodyHtml? }

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

    // Basic email validation to avoid useless SES calls
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof to !== 'string' || !emailRegex.test(to)) {
      console.warn('Invalid email provided to newsletter-confirm:', to);
      return response(400, 'Invalid email');
    }

    const interests = Array.isArray(body.interests) ? body.interests : [];
    const subject = body.subject || DEFAULT_SUBJECT;
    const htmlTemplate = body.bodyHtml || DEFAULT_HTML;
    const html = htmlTemplate.replace(/\{\{interests\}\}/g, interests.join(', '));

    console.log('Sending newsletter confirmation', { to, from: FROM_EMAIL, region: REGION });

    const result = await ses.send(new SendEmailCommand({
      Source: FROM_EMAIL,
      Destination: { ToAddresses: [to] },
      ReplyToAddresses: [FROM_EMAIL],
      Message: {
        Subject: { Data: subject, Charset: 'UTF-8' },
        Body: { Html: { Data: html, Charset: 'UTF-8' } },
      },
    }));

    console.log('SES send result', { to, messageId: result?.MessageId });

    return response(200, { ok: true, messageId: result?.MessageId });
  } catch (e) {
    // Log full error for CloudWatch
    console.error('newsletter-confirm error', e);
    // Ensure we return a serializable error message
    const errMsg = e && e.message ? e.message : JSON.stringify(e);
    return response(500, { ok: false, error: errMsg });
  }
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      // Do not set CORS headers here; Function URL CORS config will inject correct headers.
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  };
}
