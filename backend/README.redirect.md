# Redirect + TTL Setup (Guide)

This guide explains how to enable native DynamoDB TTL and use a secure redirect to extend TTL on subscriber engagement.

## 1) Enable DynamoDB TTL
- Go to DynamoDB → Tables → NewsletterSignup table → Time to live.
- Set TTL attribute name to `ttl`.
- Save and wait until status is ENABLED.

Note: TTL attribute must be a Number (epoch seconds). Our redirect Lambda writes `ttl` as a numeric attribute using the AWS SDK. Frontend should not overwrite `ttl` as a string.

## 2) Deploy the redirect Lambda
- Code: `backend/lambdas/redirect/index.js`
- Env vars:
  - `NEWSLETTER_TABLE`: DynamoDB table name for NewsletterSignup
  - `REDIRECT_TOKEN_SECRET`: strong shared secret
  - `ALLOWED_REDIRECT_HOSTS`: e.g., `www.gracechase.com,gracechase.com,open.spotify.com`
  - `TTL_EXTENSION_DAYS`: e.g., `425` (≈14 months)
- Expose: Create Function URL (or API Gateway), map `/r` on your domain to it (via CloudFront/ALB).

## 3) Generate signed tokens for email links
- When composing emails, sign `{ id, exp }` using HMAC-SHA256 with the shared secret.
- Build links like: `https://www.gracechase.com/r?to=<b64url(finalUrl)>&token=<signed>`

## 4) Update app logic
- Keep immediate deletes in Unsubscribe.
- Avoid writing `ttl` from the frontend as a string; let server-side write numeric.
- Optionally keep the scheduled cleaner as a backup (not required if native TTL suffices).

## 5) Privacy
- Add a note: “If you interact with our emails/links, we may extend retention of your subscription to keep it active; you can unsubscribe anytime.”
