import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

type Event = {
  body?: string;
};

export const handler = async (event: Event) => {
  try {
    const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1';
    const FROM_EMAIL = process.env.FROM_EMAIL || 'contact.gracechase@gmail.com';
    const DEFAULT_SUBJECT = process.env.SUBJECT_TEMPLATE || 'Thanks for subscribing to Gracechase';
    const DEFAULT_HTML =
      process.env.BODY_HTML_TEMPLATE ||
      `<div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#111">
         <p>Hi{{name}},</p>
         <p>Thanks for subscribing to Gracechase!</p>
         <p>We will email you about: <strong>{{interests}}</strong>.</p>
         <p>Grace has been chasing you,<br/>— Gracechase</p>
       </div>`;

    if (!event.body) {
      return { statusCode: 400, body: 'Missing body' };
    }

    const payload = JSON.parse(event.body);
    const toEmail: string = payload.email;
    const interests: string[] = Array.isArray(payload.interests) ? payload.interests : [];
    const name: string = payload.name ? ` ${payload.name}` : '';

    if (!toEmail) {
      return { statusCode: 400, body: 'Missing email' };
    }

    const subject: string = payload.subject || DEFAULT_SUBJECT;
    const htmlTemplate: string = payload.bodyHtml || DEFAULT_HTML;
    const htmlBody = htmlTemplate
      .replace(/\{\{email\}\}/g, toEmail)
      .replace(/\{\{name\}\}/g, name)
      .replace(/\{\{interests\}\}/g, interests.join(', '));

    const ses = new SESClient({ region });
    const cmd = new SendEmailCommand({
      Source: FROM_EMAIL,
      Destination: { ToAddresses: [toEmail] },
      ReplyToAddresses: [FROM_EMAIL],
      Message: {
        Subject: { Data: subject, Charset: 'UTF-8' },
        Body: { Html: { Data: htmlBody, Charset: 'UTF-8' } },
      },
    });

    await ses.send(cmd);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ ok: true }),
    };
  } catch (err: any) {
    console.error('newsletter-confirm error', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ ok: false, error: err?.message || 'Unknown error' }),
    };
  }
};
