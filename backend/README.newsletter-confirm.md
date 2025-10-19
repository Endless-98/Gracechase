Newsletter Confirmation Email Lambda (SES)

Overview
Create a simple Lambda in us-east-1 that sends a confirmation email via Amazon SES when a user subscribes.

1) Create Lambda
- Runtime: Node.js 20.x
- Handler file (index.js):

  const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
  const ses = new SESClient({ region: process.env.AWS_REGION || 'us-east-1' });
  exports.handler = async (event) => {
    try {
      const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body || {};
      const to = body.email;
      if (!to) return { statusCode: 400, body: 'Missing email' };
      const interests = Array.isArray(body.interests) ? body.interests : [];
      const subject = body.subject || 'Thanks for subscribing to Gracechase';
      const html = body.bodyHtml || `<div>Thanks for subscribing! Topics: ${interests.join(', ')}</div>`;
      const from = process.env.FROM_EMAIL || 'contact.gracechase@gmail.com';
      await ses.send(new SendEmailCommand({
        Source: from,
        Destination: { ToAddresses: [to] },
        ReplyToAddresses: [from],
        Message: { Subject: { Data: subject }, Body: { Html: { Data: html } } }
      }));
      return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ ok: true }) };
    } catch (e) {
      console.error(e);
      return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ ok: false, error: e.message }) };
    }
  }

- Environment variables:
  - FROM_EMAIL=contact.gracechase@gmail.com

2) Grant SES permissions
- Attach AWS managed policy AmazonSESFullAccess or a least-privilege equivalent allowing ses:SendEmail.
- In SES (us-east-1), verify the identity of contact.gracechase@gmail.com (or your domain). In Sandbox, you must verify both sender and recipient.

3) Create Function URL
- Enable Function URL (Auth: NONE)
- CORS: allow your site origin (e.g., https://www.gracechase.com) and http://localhost:5173 for dev.

4) Configure frontend
- Set .env:
  VITE_NEWSLETTER_CONFIRM_URL=https://<your-function-id>.lambda-url.us-east-1.on.aws/
- Restart dev server.

5) Test
- Submit the newsletter form; check CloudWatch Logs for the Lambda, and your inbox for the email.
