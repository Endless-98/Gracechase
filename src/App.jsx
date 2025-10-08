import { useState } from 'react';
import AlbumItem from './components/AlbumItem.jsx';
import './App.css';

function App() {
  // Sample album data (replace with API data in a real MERN app)
  const albums = [
    {
      id: 1,
      coverImage: 'images/album-covers/YourMajesty_AlbumCover.png',
      title: 'Your Majesty',
      artist: 'Gracechase',
      spotifyLink: 'https://open.spotify.com/album/0eRcQ32hkwgvSvfPPPOOhu?si=3fLeoWN0TFWaIPjgsn0PKg',
      appleMusicLink: 'https://music.apple.com/us/album/your-majesty/1841459632',
      youtubeMusicLink: 'https://music.youtube.com/channel/UCgMwhiHU4F08PfEbqK-h6gQ?si=4ArUdOi6RtFRg8d2',
    },
    // Add more albums as needed
  ];

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
            <h3>Featured Album</h3>
            {albums[0] && (
              <AlbumItem
                key={albums[0].id}
                coverImage={albums[0].coverImage}
                title={albums[0].title}
                artist={albums[0].artist}
                spotifyLink={albums[0].spotifyLink}
                appleMusicLink={albums[0].appleMusicLink}
                youtubeMusicLink={albums[0].youtubeMusicLink}
              />
            )}
          </div>

          {/* What We've Been Up To */}
          <div className="what-weve-been-up-to">
            <h3>What we've been up to</h3>
            <div className="album-release">
              <h4>Album Release</h4>
              <p>New Album announcement</p>
              {albums[0] && (
                <AlbumItem
                  key={albums[0].id + '-release'} // Unique key for same album
                  coverImage={albums[0].coverImage}
                  title={albums[0].title}
                  artist={albums[0].artist}
                  spotifyLink={albums[0].spotifyLink}
                  appleMusicLink={albums[0].appleMusicLink}
                  youtubeMusicLink={albums[0].youtubeMusicLink}
                />
              )}
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