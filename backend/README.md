# Gracechase Backend

Simple Express.js server for handling contact form submissions via AWS SES.

## Environment Variables

Create a `.env` file with:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
FROM_EMAIL=contact.gracechase@gmail.com
TO_EMAIL=contact.gracechase@gmail.com
PORT=5000
```

## Local Development

```bash
npm install
npm start
```

## Deployment

This backend is designed to be deployed on **Railway** (recommended) or **Render**:

### Railway Deployment:
1. Connect your GitHub repo to Railway
2. Railway auto-detects Node.js apps
3. Add environment variables in Railway dashboard
4. Deploy!

### Render Deployment:
1. Create new Web Service
2. Connect GitHub repo
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy!

## API Endpoints

- `GET /` - Health check
- `POST /api/send-email` - Send contact form email

## Cost

- **Railway**: $5/month after free trial
- **Render**: $7/month after free tier
- **AWS SES**: Pay per email sent (first 62,000 emails free/month)