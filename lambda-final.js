import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: 'us-east-1',  // Fixed: Match Lambda URL region
});

export const handler = async (event) => {
  // Extract method and origin with fallback
  const method = event.requestContext?.http?.method || event.httpMethod;
  const origin = event.headers?.origin || event.headers?.Origin || '';
  const allowedOrigins = [
    'https://www.gracechase.com', // Primary Amplify domain
    'https://gracechase.com',     // Added: Without www
    'https://endless-98.github.io',
    'http://localhost:3000',
    'http://localhost:4173',
    'http://localhost:5173',
    'http://localhost:5174'       // Added: Dev server port
  ];

  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Handle CORS pre-flight (OPTIONS) request
  if (method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': isAllowedOrigin ? origin : 'https://www.gracechase.com', // Dynamic
        'Access-Control-Allow-Methods': 'OPTIONS, POST',
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
        'Access-Control-Allow-Origin': 'https://www.gracechase.com',
        'Access-Control-Allow-Methods': 'OPTIONS, POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Origin not allowed', origin }),
    };
  }

  // Check for POST method
  if (method !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': origin,  // Dynamic: Return actual origin
        'Access-Control-Allow-Methods': 'OPTIONS, POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed', method }),
    };
  }

  try {
    const { name, email, message } = JSON.parse(event.body || '{}');

    if (!message) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': origin,  // Dynamic: Return actual origin
          'Access-Control-Allow-Methods': 'OPTIONS, POST',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    const params = {
      Source: process.env.FROM_EMAIL,
      Destination: {
        ToAddresses: [process.env.TO_EMAIL],
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
        'Access-Control-Allow-Origin': origin,  // Dynamic: Return actual origin
        'Access-Control-Allow-Methods': 'OPTIONS, POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ success: true, message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error('Email send error:', error.message, error.stack);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': origin,  // Dynamic: Return actual origin
        'Access-Control-Allow-Methods': 'OPTIONS, POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Failed to send email', details: error.message }),
    };
  }
};