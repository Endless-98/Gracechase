import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AlbumItem from './components/AlbumItem.jsx';
import Blog from './components/Blog.jsx';
import BlogPost from './components/BlogPost.jsx';
import Privacy from './components/Privacy.jsx';
import Contact from './components/Contact.jsx';
import './App.css';

function App() {
  // Sample album data (replace with API data in a real MERN app)
  const albums = [
    {
      id: 1,
      spotifyEmbedIframe: '<iframe data-testid="embed-iframe" className="spotify-embed" style={{borderRadius: "12px"}} src={`https://open.spotify.com/embed/album/${albumId}?utm_source=generator`} width="100%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
      spotifyLink: 'https://open.spotify.com/album/0eRcQ32hkwgvSvfPPPOOhu?si=3fLeoWN0TFWaIPjgsn0PKg',
      appleMusicLink: 'https://music.apple.com/us/album/your-majesty/1841459632',
      youtubeMusicLink: 'https://music.youtube.com/playlist?list=OLAK5uy_kVbhrim-szUB-OAs0nCayOWOijpXukKCA&si=WFnipm4d5J3fED_X',
    },
    {
      id: 2,
      spotifyEmbedIframe: '<iframe data-testid="embed-iframe" className="spotify-embed" style={{borderRadius: "12px"}} src={`https://open.spotify.com/embed/album/5Tt1sGIoAnpzRHY3abDqz4?utm_source=generator`} width="100%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
      spotifyLink: 'https://open.spotify.com/album/5Tt1sGIoAnpzRHY3abDqz4?si=3fLeoWN0TFWaIPjgsn0PKg',
      appleMusicLink: 'https://music.apple.com/us/album/im-still-your-love-single/1835662171',
      youtubeMusicLink: 'https://music.youtube.com/watch?v=QoaeKUHDJM8&si=IEWUMM8N6seCrzPe',
    },
  ];

  return (
    <Routes>
      <Route path="/" element={
        <div className="main-page">
          {/* Navbar */}
          <div className="header">
            <nav className="navbar">
              <p><Link to="/" className="nav-link" onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('about');
                if (element) {
                  const offset = 100;
                  const rect = element.getBoundingClientRect();
                  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                  const elementTop = rect.top + scrollTop;
                  window.scrollTo({
                    top: elementTop - offset,
                    behavior: 'smooth'
                  });
                }
              }}>About</Link></p>
              <p><Link to="/" className="nav-link" onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('releases');
                if (element) {
                  const offset = 100;
                  const rect = element.getBoundingClientRect();
                  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                  const elementTop = rect.top + scrollTop;
                  window.scrollTo({
                    top: elementTop - offset,
                    behavior: 'smooth'
                  });
                }
              }}>Releases</Link></p>
              {/* <p><Link to="/blog" className="nav-link">Blog</Link></p> */}
              <p><Link to="/contact" className="nav-link">Contact</Link></p>
            </nav>
          </div>

          {/* Logo and Band Hero Shot */}
          <header className="hero-section">
            <img
              className="hero-image"
              src="images/site-banners/YMBG.jpg"
              alt="The Gracechase band in an epic silhouette with a golden lit background"
            />
          </header>

          {/* Releases Section */}
          <section className="releases-section" id="releases">
            <h2>Releases</h2>
            <div className="releases-grid">
              {/* Featured Album using AlbumItem */}
              <div className="featured-album">
                {albums.map((album) => (
                  <AlbumItem
                    key={album.id}
                    spotifyLink={album.spotifyLink}
                    youtubeMusicLink={album.youtubeMusicLink}
                    appleMusicLink={album.appleMusicLink}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="about-section" id="about">
            <h2>About Gracechase</h2>
            <p>Grace has been chasing you. Maybe it's time to stop running.</p>
            <div className="about-content">
              <div className="about-subsection">
                <h3>Our Story</h3>
                <p>
                  Hey there! We are Gracechase. We're an innovative music group that combines our musical creativity with cutting edge AI technology to create songs that are beautiful and exciting, and aim to point the listener back to our Creator.
                </p>
              </div>
              <div className="about-subsection">
                <h3>What inspires us</h3>
                <p>
                  We are deeply moved by the Grace of our Lord Jesus, and we want to remind our listeners of His unending love and mercy through our music. We love to write, and to share our stories, and we hope that we can inspire our listeners to the awe and wonder of creation, and of the One who made it all.
                </p>
              </div>
              {/* <div className="about-subsection">
                 <h3>Meet the Crew</h3>
                <p>Gracechase is brought to life by a team of AI "characters" and human collaborators:</p>
                <ul>
                  <li><strong>Grace:</strong> The lead AI composer, inspired by classical elegance.</li>
                  <li><strong>Chase:</strong> The rhythm generator, driven by dynamic energy.</li>
                  <li><strong>Harmony:</strong> The human arranger, adding emotional depth.</li>
                  <li><strong>Echo:</strong> The sound designer, crafting immersive audio experiences.</li>
                </ul>
              </div> */}
            </div>
          </section>

          <section className='footer'>
            <div className='footer-content'>
              <p>&copy; 2025 Gracechase. All rights reserved. | <Link to="/privacy">Privacy Policy</Link></p>
            </div>
          </section>
        </div>
      } />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogPost />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default App;
