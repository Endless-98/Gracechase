import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: 'us-east-1',
});

export const handler = async (event: any) => {
  // Check origin for security
  const origin = event.headers?.origin || event.headers?.Origin;
  const allowedOrigins = [
    'https://gracechase.com',
    'https://endless-98.github.io',
    'http://localhost:3000', // for development
    'http://localhost:4173', // for Vite preview
    'http://localhost:5173', // for Vite dev server
    'http://localhost:5174'  // for Vite dev server (alternative port)
  ];

  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Handle CORS preflight
  if (event.requestContext?.http?.method === 'OPTIONS' ||
      event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': isAllowedOrigin ? origin : 'https://gracechase.com',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
      body: '',
    };
  }

  // Reject requests from non-allowed origins
  if (!isAllowedOrigin) {
    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': 'https://gracechase.com',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Origin not allowed' }),
    };
  }

  if (event.requestContext?.http?.method !== 'POST' &&
      event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': origin || 'https://gracechase.com',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { name, email, message } = JSON.parse(event.body || '{}');

    if (!message) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': origin || 'https://gracechase.com',
          'Content-Type': 'application/json',
        },
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
      headers: {
        'Access-Control-Allow-Origin': origin || 'https://gracechase.com',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ success: true, message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error('Email send error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': origin || 'https://gracechase.com',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Failed to send email' }),
    };
  }
};