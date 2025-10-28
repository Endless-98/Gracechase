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
   - `VITE_GA_MEASUREMENT_ID` (optional)
   - Other optional URLs as needed by features (see `.env`)
4. Install frontend deps at repo root: `npm install`
5. Start development server: `npm run dev`

### Environment Variables (frontend)

- `VITE_GA_MEASUREMENT_ID`: Google Analytics 4 Measurement ID (optional)
- `VITE_NEWSLETTER_CONFIRM_URL`: Newsletter confirm Lambda URL (optional)
- `VITE_TTL_INACTIVE_DAYS`: Retention window hint for client features (optional)

### Architecture

This site runs fully in the browser and talks directly to AWS services (Amplify/AppSync, Lambda URLs). No separate backend server is required for development or GitHub Pages.

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
