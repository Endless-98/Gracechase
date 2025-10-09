import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AlbumItem from './components/AlbumItem.jsx';
import Blog from './components/Blog.jsx';
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
              <p><Link to="/#" className="nav-link">Home</Link></p>
              <p><Link to="/about" className="nav-link">About</Link></p>
              <p><Link to="/releases" className="nav-link">Releases</Link></p>
              <p><Link to="/blog" className="nav-link">Blog</Link></p>
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
          <section className="releases-section">
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

          {/* Meet the Crew Section */}
          {/*      
          <section className="meet-the-crew-section">
            <h2>Meet the Crew</h2>
            <p>Some kind of explanation that they are AI characters</p>
            <div className="crew-list">
              <h4>List the cast of characters</h4>
              <ul>
                <li>Character 1: Description</li>
                <li>Character 2: Description</li>
                <li>Character 3: Description</li>
              </ul>
            </div>
          </section>
          */}
          <section className='footer'>
            <div className='footer-content'>
              <p>&copy; 2025 Gracechase. All rights reserved.</p>
            </div>
          </section>
        </div>
      } />
      <Route path="/blog" element={<Blog />} />
    </Routes>
  );
}

export default App;