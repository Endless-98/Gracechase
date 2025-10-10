const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

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

app.use(cors());
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
