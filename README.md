# Gracechase.com

https://endless-98.github.io/Gracechase/
A clean, modern website for the artist Gracechase, built with React. Showcases music albums and blog posts with a golden theme.

![Gracechase Hero](public/images/site-banners/YMBG.jpg)

## Description

This is a single-page website featuring a home page with album displays and a blog. It uses responsive design for mobile and desktop.

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env`
3. Fill in your Google Analytics 4 Measurement ID in `.env`
4. Set up EmailJS (see below) and add the credentials to `.env`
5. Install dependencies: `npm install`
6. Start development server: `npm run dev`

### Environment Variables

- `VITE_GA_MEASUREMENT_ID`: Your Google Analytics 4 Measurement ID (required for analytics)
- `VITE_API_URL`: API URL for development (optional)

### AWS SES Setup (For Email)

1. Sign up for AWS account and go to SES console
2. Verify your sender email address (`FROM_EMAIL`)
3. Create IAM user with SES permissions or use access keys
4. Add these to `backend/.env`:
   ```
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   FROM_EMAIL=your-verified-email@example.com
   TO_EMAIL=contact.gracechase@gmail.com
   ```
5. Run the backend: `cd backend && npm install && npm start`

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
