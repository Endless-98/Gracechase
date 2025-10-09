# Gracechase.com

A modern, minimalist portfolio website for the musical artist Gracechase, showcasing albums, music releases, and blog content.

![Gracechase Hero](public/images/site-banners/YMBG.jpg)

## Description

Gracechase.com is a single-page application (SPA) built with React, featuring a clean design inspired by the artist's golden-themed aesthetic. It includes an interactive home page with album embeds, a blog for updates and stories, and responsive navigation.

## Features

- **Home Page**: Hero image, album releases with Spotify embeds, and streaming links.
- **Blog Page**: Templated blog posts with images, dates, and excerpts.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **Modern UI**: Minimalist palette with gold accents, smooth transitions.
- **SPA Routing**: Client-side navigation with React Router (HashRouter for GitHub Pages compatibility).

## Tech Stack

- **Frontend**: React 19, Vite
- **Routing**: React Router DOM
- **Icons**: Simple Icons
- **Styling**: CSS (custom, no frameworks)
- **Deployment**: GitHub Pages (via gh-pages)
- **Build Tool**: Vite

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Endless-98/Gracechase.com.git
   cd Gracechase.com
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

- **Development**: Run `npm run dev` for hot-reloading.
- **Build**: Run `npm run build` to create a production build in `dist/`.
- **Preview**: Run `npm run preview` to test the build locally.
- **Deploy**: Run `npm run deploy` to publish to GitHub Pages.

### Project Structure

```
Gracechase.com/
├── public/
│   ├── images/
│   │   ├── album-covers/
│   │   └── site-banners/
│   └── 404.html
├── src/
│   ├── components/
│   │   ├── AlbumItem.jsx
│   │   ├── AlbumItem.css
│   │   ├── Blog.jsx
│   │   └── Blog.css
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── vite.config.js
├── package.json
└── README.md
```

## Deployment

The site is deployed to GitHub Pages at [https://endless-98.github.io/Gracechase.com/](https://endless-98.github.io/Gracechase.com/).

- Uses HashRouter for SPA routing compatibility.
- Base path set to `/Gracechase/` for subdirectory deployment.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m 'Add your feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Contact

- **Artist**: Gracechase
- **Developer**: Endless-98
- **Repository**: [GitHub](https://github.com/Endless-98/Gracechase.com)

---

*Built with ❤️ for music lovers.*
