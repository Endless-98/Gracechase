import { useState } from 'react';
import './App.css';

function App() {

  return (
    <div className="main-page">
      {/* Navbar */}
      <div className="header">
        <nav className="navbar">
          <p><a href="#" className="nav-link">Home</a></p>
          <p><a href="#" className="nav-link">About</a></p>
          <p><a href="#" className="nav-link">Releases</a></p>
          <p><a href="#" className="nav-link">Blog</a></p>
          <p><a href="#" className="nav-link">Contact</a></p>
        </nav>
      </div>

      {/* Logo and Band Hero Shot */}
      <header className="hero-section">
        <img className="hero-image" src="images/site-banners/YMBG.jpg" alt="The Gracechase band in an epic sillouhette with a golden lit background" />
      </header>

      {/* Releases Section */}
      <section className="releases-section">
        <h2>Releases</h2>
        <div className="releases-grid">
          {/* Featured Album with Album Banner and Platform Links */}
          <div className="featured-album">
            <h3>Featured Album</h3>
            <div className="album-banner">
              <img src="images/album-covers/YourMajesty_AlbumCover.png"
               alt="Album Banner" />
              <p>Link that takes you to the album, using the streaming service you selected</p>
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
              <img src="images/album-covers/YourMajesty_AlbumCover.png" alt="New Album"/>
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