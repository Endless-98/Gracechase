import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LetMyHeartFindChristmas.css';

const LetMyHeartFindChristmas = () => {
  const songData = {
    spotifyLink: 'https://open.spotify.com/track/4VnoAeof0MtBF1VH8yZUYC',
    amazonMusicLink: 'https://music.amazon.com/albums/B0FWZ9VRCF?trackAsin=B0FWZBM8KC',
    appleMusicLink: 'https://music.apple.com/us/album/let-my-heart-find-christmas/1847634777?i=1847634778',
    youtubeMusicLink: 'https://music.youtube.com/watch?v=zNIB-Z5WQJY',
    youtubeVideoId: 'XyBUSEm6a7A', // Replace with actual video ID when available
  };

  const albumData = {
    spotifyAlbumId: '0FDPRyIXg50LXOdgH8g65b',
    spotifyLink: 'https://open.spotify.com/album/0FDPRyIXg50LXOdgH8g65b',
    amazonMusicLink: 'https://music.amazon.com/albums/B0FWZ9VRCF',
    appleMusicLink: 'https://music.apple.com/us/album/even-better-christmas/1847634777',
    youtubeMusicLink: 'https://music.youtube.com/playlist?list=OLAK5uy_n_fdOT3WVxXeKfjr-h2arrYbk623z3VRU',
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  return (
    <div className="lmhfc-page">
      {/* Header */}
      <div className="lmhfc-header">
        <nav className="lmhfc-navbar">
          <p><Link to="/" className="lmhfc-nav-link">Home</Link></p>
          <p><Link to="/newsletter" className="lmhfc-nav-link">Stay in touch</Link></p>
        </nav>
      </div>

      <div className="lmhfc-content-wrapper">
        {/* 1. Headline */}
        <h1 className="lmhfc-headline">The Christmas Song That Finds You.</h1>

        {/* 2. Hero Video */}
        <div className="lmhfc-video-container">
          <iframe
            className="lmhfc-video"
            src={`https://www.youtube.com/embed/${songData.youtubeVideoId}?autoplay=0&rel=0`}
            title="Let My Heart Find Christmas - Music Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>

        {/* 3. Primary CTA */}
        <div className="lmhfc-primary-cta">
          <h2 className="lmhfc-cta-headline">SAVE/STREAM THIS SONG NOW</h2>
          
          <div className="lmhfc-streaming-buttons">
            {/* Spotify - largest/most prominent */}
            {songData.spotifyLink && (
              <a
                href={songData.spotifyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="lmhfc-btn lmhfc-btn-spotify"
                onClick={() => window.gtag && window.gtag('event', 'music_service_click', { 
                  service: 'spotify', 
                  song: 'let_my_heart_find_christmas',
                  context: 'primary_cta'
                })}
              >
                <img src="images/link-icons/spotify_logo.png" alt="" />
                <span>Listen on Spotify</span>
              </a>
            )}

            {/* Apple Music */}
            {songData.appleMusicLink && (
              <a
                href={songData.appleMusicLink}
                target="_blank"
                rel="noopener noreferrer"
                className="lmhfc-btn lmhfc-btn-apple"
                onClick={() => window.gtag && window.gtag('event', 'music_service_click', { 
                  service: 'apple_music', 
                  song: 'let_my_heart_find_christmas',
                  context: 'primary_cta'
                })}
              >
                <img src="images/link-icons/apple_music_logo.png" alt="" />
                <span>Listen on Apple Music</span>
              </a>
            )}

            {/* YouTube Music */}
            {songData.youtubeMusicLink && (
              <a
                href={songData.youtubeMusicLink}
                target="_blank"
                rel="noopener noreferrer"
                className="lmhfc-btn lmhfc-btn-youtube"
                onClick={() => window.gtag && window.gtag('event', 'music_service_click', { 
                  service: 'youtube_music', 
                  song: 'let_my_heart_find_christmas',
                  context: 'primary_cta'
                })}
              >
                <img src="images/link-icons/YT_music_logo.png" alt="" />
                <span>Listen on YouTube Music</span>
              </a>
            )}

            {/* Amazon Music */}
            {songData.amazonMusicLink && (
              <a
                href={songData.amazonMusicLink}
                target="_blank"
                rel="noopener noreferrer"
                className="lmhfc-btn lmhfc-btn-amazon"
                onClick={() => window.gtag && window.gtag('event', 'music_service_click', { 
                  service: 'amazon_music', 
                  song: 'let_my_heart_find_christmas',
                  context: 'primary_cta'
                })}
              >
                <img src="images/link-icons/amazon_music_logo.png" alt="" />
                <span>Listen on Amazon Music</span>
              </a>
            )}
          </div>
        </div>

        {/* 4. Secondary Album Offer */}
        <div className="lmhfc-album-section">
          <h3 className="lmhfc-album-heading">Explore the Full Album</h3>
          <p className="lmhfc-album-subheading">Even Better Christmas</p>
          
          <div className="lmhfc-album-content">
            <img 
              src="images/album-covers/Even Better Christmas Cover 1000px.jpg" 
              alt="Even Better Christmas Album Cover" 
              className="lmhfc-album-cover"
            />
            
            <iframe
              className="lmhfc-album-embed"
              style={{borderRadius: '12px'}}
              src={`https://open.spotify.com/embed/album/${albumData.spotifyAlbumId}?utm_source=generator`}
              width="100%"
              height="380"
              frameBorder="0"
              allowFullScreen=""
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          </div>

          <div className="lmhfc-album-links">
            {albumData.spotifyLink && (
              <a
                href={albumData.spotifyLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Stream album on Spotify"
                onClick={() => window.gtag && window.gtag('event', 'music_service_click', { 
                  service: 'spotify', 
                  album: 'even_better_christmas',
                  context: 'secondary_album_offer'
                })}
              >
                <img src="images/link-icons/spotify_logo.png" alt="Spotify" />
              </a>
            )}
            {albumData.youtubeMusicLink && (
              <a
                href={albumData.youtubeMusicLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Stream album on YouTube Music"
                onClick={() => window.gtag && window.gtag('event', 'music_service_click', { 
                  service: 'youtube_music', 
                  album: 'even_better_christmas',
                  context: 'secondary_album_offer'
                })}
              >
                <img src="images/link-icons/YT_music_logo.png" alt="YouTube Music" />
              </a>
            )}
            {albumData.appleMusicLink && (
              <a
                href={albumData.appleMusicLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Stream album on Apple Music"
                onClick={() => window.gtag && window.gtag('event', 'music_service_click', { 
                  service: 'apple_music', 
                  album: 'even_better_christmas',
                  context: 'secondary_album_offer'
                })}
              >
                <img src="images/link-icons/apple_music_logo.png" alt="Apple Music" />
              </a>
            )}
            {albumData.amazonMusicLink && (
              <a
                href={albumData.amazonMusicLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Stream album on Amazon Music"
                onClick={() => window.gtag && window.gtag('event', 'music_service_click', { 
                  service: 'amazon_music', 
                  album: 'even_better_christmas',
                  context: 'secondary_album_offer'
                })}
              >
                <img src="images/link-icons/amazon_music_logo.png" alt="Amazon Music" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetMyHeartFindChristmas;
