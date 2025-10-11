import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: 'us-east-1',
});

export const handler = async (event: any) => {
  // Handle CORS preflight
  if (event.requestContext?.http?.method === 'OPTIONS' ||
      event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  if (event.requestContext?.http?.method !== 'POST' &&
      event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { name, email, message } = JSON.parse(event.body || '{}');

    if (!message) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    const params = {
      Source: process.env.FROM_EMAIL!,
      Destination: {
        ToAddresses: [process.env.TO_EMAIL!],
      },
      Message: {
        Subject: {
          Data: `Contact Form: ${name || 'Anonymous'}`,
        },
        Body: {
          Text: {
            Data: `Name: ${name || 'Not provided'}
Email: ${email || 'Not provided'}

Message:
${message}`,
          },
        },
      },
    };

    await sesClient.send(new SendEmailCommand(params));

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error('Email send error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to send email' }),
    };
  }
};