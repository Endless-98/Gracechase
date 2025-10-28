# Gracechase Backend

Express.js server for contact form (AWS SES) and newsletter signup (DynamoDB + Turnstile).

## Prerequisites

- An existing DynamoDB table for newsletter signups (we reuse your existing table).
	- Primary key: `id` (String)
	- TTL attribute: `ttl` (Number, seconds since epoch). Enable TTL in the table settings targeting the `ttl` attribute.
- AWS credentials with SES (for contact form) and DynamoDB permissions.
- Cloudflare Turnstile site (free) for bot protection.

## Environment Variables

Create `backend/.env` (copy from `backend/.env.example`) and fill values:

```env
PORT=5000

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# SES (contact form)
FROM_EMAIL=contact.gracechase@gmail.com
TO_EMAIL=contact.gracechase@gmail.com

# Newsletter (DynamoDB table name)
NEWSLETTER_TABLE=YourNewsletterTableName

# CORS allowlist (comma-separated). Include localhost and your live domains.
ALLOWED_ORIGINS=http://localhost:5173,https://gracechase.com

# Cloudflare Turnstile secret (server-side). If empty, verification is skipped in dev.
TURNSTILE_SECRET=your_turnstile_secret

# Rate limiting (optional)
RATE_WINDOW_MS=60000
RATE_MAX=10

# Inactive retention window in days (default ~14 months = 425 days)
# Old name TTL_PENDING_DAYS is still supported if set
TTL_INACTIVE_DAYS=425
```

Frontend `.env` (copy from project root `.env.example`) should include:

```env
VITE_BACKEND_BASE_URL=http://localhost:5000
VITE_TURNSTILE_SITEKEY=your_public_site_key
VITE_SEND_CONFIRM_EMAIL=false
```

## Local Development

1. Backend
	 ```bash
	 cd backend
	 npm install
	 cp .env.example .env
	 # edit .env and set AWS creds, NEWSLETTER_TABLE, ALLOWED_ORIGINS, etc.
	 npm start
	 # Server runs on http://localhost:5000
	 ```
2. Frontend (in a new terminal)
	 ```bash
	 cd ..
	 cp .env.example .env
	 # edit .env: set VITE_BACKEND_BASE_URL to http://localhost:5000 and Turnstile site key
	 npm install
	 npm run dev
	 # App runs on http://localhost:5173
	 ```

## Deployment

Deploy on Railway or Render:

1. Connect GitHub repo.
2. Build command: `npm install` (for backend service).
3. Start command: `npm start`.
4. Set environment variables in the platform dashboard:
	 - `AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY`
	 - `FROM_EMAIL, TO_EMAIL`
	 - `NEWSLETTER_TABLE`
	 - `ALLOWED_ORIGINS` (must include your production frontend origin, e.g., https://gracechase.com)
	 - `TURNSTILE_SECRET`
5. Update frontend `.env` and rebuild with `VITE_BACKEND_BASE_URL` set to your deployed backend URL.

## API Endpoints

- `GET /` – Health check
- `POST /api/send-email` – Send contact form email (SES)
- `POST /api/newsletter-signup` – Create/update newsletter signup (validates email, Turnstile, rate limits, logs consent, sets TTL)

### Quick test (local)

With `TURNSTILE_SECRET` empty (dev mode skips verification):

```bash
curl -s -X POST http://localhost:5000/api/newsletter-signup \
	-H 'Content-Type: application/json' \
	-d '{
		"email": "test@example.com",
		"interests": ["new-releases"],
		"consentTextVersion": "v1",
		"referrerPath": "/newsletter",
		"turnstileToken": ""
	}'
```

Response includes `{ ok: true, status: "pending", id }`. Verify the item in DynamoDB; `ttl` should be set in seconds.

## Notes

- CORS: If you see CORS errors in the browser, ensure your frontend origin is present in `ALLOWED_ORIGINS` exactly (including scheme and host).
- Turnstile: In production, set both `TURNSTILE_SECRET` (backend) and `VITE_TURNSTILE_SITEKEY` (frontend), and ensure the script tag exists in `public/index.html`.
- DynamoDB at scale: To avoid scans by email, consider adding a GSI on `email` (not required for low volume).