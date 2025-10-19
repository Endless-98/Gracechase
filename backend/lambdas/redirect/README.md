# Redirect Lambda (TTL Bump on Engagement)

Purpose: Safely update a subscriber's DynamoDB TTL when they click a link, then 302-redirect them to the final URL. Ensures great UX (no interstitial), security (signed tokens), and reliable retention management.

## How it works
- Email links point to: `https://www.gracechase.com/r?to=<base64url(finalUrl)>&token=<signed>`
- The Lambda validates `token` (signed with `REDIRECT_TOKEN_SECRET`) which encodes the subscriber's `id` and `exp` (expiry).
- If valid and not a bot/HEAD request, it sets the DynamoDB `ttl` attribute as a Number (epoch seconds), extending retention (e.g., +30 days).
- Immediately responds with `302 Location: <finalUrl>`.

## Environment variables
- `AWS_REGION`: us-east-1 (default okay)
- `NEWSLETTER_TABLE`: DynamoDB table name for NewsletterSignup
- `REDIRECT_TOKEN_SECRET`: a strong random secret for signing/verification
- `ALLOWED_REDIRECT_HOSTS`: comma-separated host allow-list (e.g., `www.gracechase.com,gracechase.com,open.spotify.com`)
- `TTL_EXTENSION_DAYS`: number of days to extend TTL on valid engagement (default 30)

## Token format
- Payload fields: `{ id: string, exp: number }`
- Token: `base64url(JSON(payload)) + '.' + base64url(HMAC_SHA256(payload, secret))`
- Generate server-side when composing emails. Example Node snippet:

```js
const crypto = require('crypto');
function b64url(buf) { return Buffer.from(buf).toString('base64').replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_'); }
function signToken(payload, secret) {
  const body = Buffer.from(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', secret).update(body).digest();
  return b64url(body) + '.' + b64url(sig);
}
// Usage: signToken({ id: 'SUBSCRIBER_ID', exp: Math.floor(Date.now()/1000)+60*60*24*7 }, process.env.REDIRECT_TOKEN_SECRET)
```

## Deployment notes
- Package with AWS SDK v3 for DynamoDB (@aws-sdk/client-dynamodb) or use a layer. Node.js 20 runtime recommended.
- Create a Lambda Function URL or API Gateway endpoint, then map `/r` on your domain (e.g., via CloudFront/ALB) to this Lambda.
- Enable HTTPS. Keep the function in `us-east-1` for low latency.

## Security & UX
- Domain allow-list prevents open redirects.
- Bot/HEAD detection reduces false engagements from email scanners.
- Always 302 quickly; never render an interstitial page.