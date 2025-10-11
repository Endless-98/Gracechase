"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_ses_1 = require("@aws-sdk/client-ses");
const sesClient = new client_ses_1.SESClient({
    region: process.env.AWS_REGION || 'us-west-2',
});
const handler = async (event) => {
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
        await sesClient.send(new client_ses_1.SendEmailCommand(params));
        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ success: true, message: 'Email sent successfully' }),
        };
    }
    catch (error) {
        console.error('Email send error:', error);
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Failed to send email' }),
        };
    }
};
exports.handler = handler;
