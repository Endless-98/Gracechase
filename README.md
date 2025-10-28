# Gracechase.com

https://endless-98.github.io/Gracechase/
A clean, modern website for the artist Gracechase, built with React. Showcases music albums and blog posts with a golden theme.

![Gracechase Hero](public/images/site-banners/YMBG.jpg)

## Description

This is a single-page website featuring a home page with album displays and a blog. It uses responsive design for mobile and desktop.

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env`
3. Fill in the environment variables:
   - `VITE_BACKEND_BASE_URL` (e.g., http://localhost:5000 for local dev)
   - `VITE_TURNSTILE_SITEKEY` (from Cloudflare Turnstile; optional for dev)
   - `VITE_GA_MEASUREMENT_ID` (optional)
4. Backend setup: see `backend/README.md` for AWS/SES/DynamoDB/Turnstile envs. Quick start:
   - `cd backend && cp .env.example .env && npm install && npm start`
5. Install frontend deps at repo root: `npm install`
6. Start development server: `npm run dev`

### Environment Variables (frontend)

- `VITE_BACKEND_BASE_URL`: Your backend base URL (http://localhost:5000 in dev)
- `VITE_TURNSTILE_SITEKEY`: Cloudflare Turnstile site key (public; optional in dev)
- `VITE_SEND_CONFIRM_EMAIL`: Feature flag to enable confirmation emails (default false)
- `VITE_GA_MEASUREMENT_ID`: Google Analytics 4 Measurement ID (optional)

### Backend Setup (SES + Newsletter)

See `backend/README.md` for full instructions. Summary:

1. SES: Verify `FROM_EMAIL` and set AWS creds.
2. DynamoDB: Use your existing table (with `id` PK and `ttl` TTL attribute enabled). Set `NEWSLETTER_TABLE` in backend `.env`.
3. Turnstile: Create a site in Cloudflare. Put site key in frontend `.env` and secret in `backend/.env`.
4. CORS: Ensure `ALLOWED_ORIGINS` (backend) includes your frontend origins.
5. Run backend: `cd backend && npm start`.

**Note**: AWS SES has a free tier (62,000 emails/month for first 12 months), then pay per email.

## Features

- Home page with hero image and album list
- Blog with posts and images
- Navigation between pages
- Works on phones and computers

## Tech Stack

- React (for building the site)
- Vite (for fast development)
- React Router (for page navigation)
- CSS (for styling)
- GitHub Pages (for hosting)

## Skills Demonstrated

- Building interactive websites with React
- Making sites work on different devices
- Handling navigation and routing
- Deploying to the web

## License

View-only license. You can look at the code but not use or copy it. See [LICENSE](LICENSE).

## Contact

- Developer: Endless-98
- Repository: [GitHub](https://github.com/Endless-98/Gracechase.com)

---

*Portfolio project showcasing web development.*
