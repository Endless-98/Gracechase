import { siSpotify, siYoutube, siApplemusic } from 'simple-icons/icons';
import './AlbumItem.css'; 

const AlbumItem = ({ coverImage, title, artist, spotifyLink, youtubeMusicLink, appleMusicLink }) => {
  return (
    <div className="album-item">
      <img src={coverImage} alt={`${title} album cover`} className="album-cover" />
      <h3>{title}</h3>
      <p>{artist}</p>
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
              <path d={siYoutube.path} />
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