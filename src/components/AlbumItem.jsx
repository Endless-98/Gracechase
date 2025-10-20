import { siSpotify, siYoutubemusic, siApplemusic, siYoutube } from 'simple-icons';
import './AlbumItem.css'; 

const AlbumItem = ({ spotifyLink, youtubeMusicLink, youtubeLink, appleMusicLink, amazonMusicLink }) => {
  const getAlbumId = (link) => {
    if (!link) return null;
    const match = link.match(/album\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  const albumId = getAlbumId(spotifyLink);

  return (
      <div className="album-container"> 
        {albumId && (
          <iframe data-testid="embed-iframe" className="spotify-embed" style={{borderRadius: '12px'}} src={`https://open.spotify.com/embed/album/${albumId}?utm_source=generator`} width="100%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        )}
        <div className="streaming-links">
          {spotifyLink && (
            <a href={spotifyLink} target="_blank" rel="noopener noreferrer" aria-label="Listen on Spotify" onClick={() => window.gtag && window.gtag('event', 'music_service_click', { service: 'spotify' })}>
              <svg role="img" viewBox="0 0 24 24" width="24" height="24" fill={`#${siSpotify.hex}`}>
                <path d={siSpotify.path} />
              </svg>
            </a>
          )}
          {youtubeMusicLink && (
            <a href={youtubeMusicLink} target="_blank" rel="noopener noreferrer" aria-label="Listen on YouTube music" onClick={() => window.gtag && window.gtag('event', 'music_service_click', { service: 'youtube_music' })}>
              <svg role="img" viewBox="0 0 24 24" width="24" height="24" fill={`#${siYoutubemusic.hex}`}>
                <path d={siYoutubemusic.path} />
              </svg>
            </a>
          )}
          {youtubeLink && (
            <a href={youtubeLink} target="_blank" rel="noopener noreferrer" aria-label="Watch on YouTube" onClick={() => window.gtag && window.gtag('event', 'music_service_click', { service: 'youtube' })}>
              <svg role="img" viewBox="0 0 24 24" width="24" height="24" fill={`#${siYoutube.hex}`}>
                <path d={siYoutube.path} />
              </svg>
            </a>
          )}
          {appleMusicLink && (
            <a href={appleMusicLink} target="_blank" rel="noopener noreferrer" aria-label="Listen on Apple Music" onClick={() => window.gtag && window.gtag('event', 'music_service_click', { service: 'apple_music' })}>
              <svg role="img" viewBox="0 0 24 24" width="24" height="24" fill={`#${siApplemusic.hex}`}>
                <path d={siApplemusic.path} />
              </svg>
            </a>
          )}
          {amazonMusicLink && (
            <a href={amazonMusicLink} target="_blank" rel="noopener noreferrer" aria-label="Listen on Amazon Music" onClick={() => window.gtag && window.gtag('event', 'music_service_click', { service: 'amazon_music' })}>
              <img src="images/album-covers/AmazonMusicLogo.png" alt="Amazon Music" width="24" height="24" />
            </a>
          )}
        </div>
      </div>
  );
};

export default AlbumItem;