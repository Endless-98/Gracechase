import { siSpotify, siYoutubemusic, siApplemusic } from 'simple-icons';
import './AlbumItem.css'; 

const AlbumItem = ({ coverImage, title, artist, spotifyLink, youtubeMusicLink, appleMusicLink }) => {
  const getAlbumId = (link) => {
    if (!link) return null;
    const match = link.match(/album\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  const albumId = getAlbumId(spotifyLink);

  return (
      <div className="album-container"> 
        {albumId && (
          <iframe data-testid="embed-iframe" style={{borderRadius: '12px'}} src={`https://open.spotify.com/embed/album/${albumId}?utm_source=generator`} width="100%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        )}
        <div className="streaming-links">
          {spotifyLink && (
            <a href={spotifyLink} target="_blank" rel="noopener noreferrer" aria-label="Listen on Spotify">
              <svg role="img" viewBox="0 0 24 24" width="24" height="24" fill="#1DB954">
                <path d={siSpotify.path} />
              </svg>
            </a>
          )}
          {youtubeMusicLink && (
            <a href={youtubeMusicLink} target="_blank" rel="noopener noreferrer" aria-label="Listen on YouTube music">
              <svg role="img" viewBox="0 0 24 24" width="24" height="24" fill="#FF0000">
                <path d={siYoutubemusic.path} />
              </svg>
            </a>
          )}
          {appleMusicLink && (
            <a href={appleMusicLink} target="_blank" rel="noopener noreferrer" aria-label="Listen on Apple Music">
              <svg role="img" viewBox="0 0 24 24" width="24" height="24" fill="#FA1D61">
                <path d={siApplemusic.path} />
              </svg>
            </a>
          )}
        </div>
      </div>
  );
};

export default AlbumItem;