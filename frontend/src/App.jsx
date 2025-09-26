import { useState } from 'react';
import './App.css';

function App() {
  // For demonstration, keeping a simple state if needed; can remove later
  const [count, setCount] = useState(0);

  return (
    <div className="main-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-links">
          <a href="#" className="nav-link">Home</a>
          <a href="#" className="nav-link">About</a>
          <a href="#" className="nav-link">Releases</a>
          <a href="#" className="nav-link">Blog</a>
          <a href="#" className="nav-link">Contact</a>
        </div>
      </nav>

      {/* Logo and Band Hero Shot */}
      <header className="hero-section">
        <img src="https://via.placeholder.com/1200x400/cccccc/000000?text=Logo+and+Band+Hero+Shot" alt="Logo and Band Hero Shot" className="hero-image" />
      </header>

      {/* Releases Section */}
      <section className="releases-section">
        <h2>Releases</h2>
        <div className="releases-grid">
          {/* Featured Album with Album Banner and Platform Links */}
          <div className="featured-album">
            <h3>Featured Album</h3>
            <div className="album-banner">
              <img src="https://via.placeholder.com/600x300/ff69b4/ffffff?text=Album+Banner" alt="Album Banner" />
              <p>Link sharing the latest single/maybe you used</p>
            </div>
            <div className="platform-links">
              <h4>Platform Links</h4>
              <a href="#" className="platform-link">Spotify</a>
              <a href="#" className="platform-link">Apple Music</a>
              <a href="#" className="platform-link">Bandcamp</a>
            </div>
          </div>

          {/* What We've Been Up To */}
          <div className="what-weve-been-up-to">
            <h3>What we've been up to</h3>
            <div className="album-release">
              <h4>Album Release</h4>
              <p>New Album announcement</p>
              <img src="https://via.placeholder.com/300x200/4caf50/ffffff?text=New+Album" alt="New Album" />
            </div>
            <div className="blog-post">
              <h4>Blog Post</h4>
              <p>Blog Posts</p>
              <a href="#">Read More</a>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Crew Section */}
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

    </div>
  );
}

export default App;