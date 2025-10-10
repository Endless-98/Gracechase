import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Privacy.css';

const Privacy = () => {
  const [optedOut, setOptedOut] = useState(false);

  useEffect(() => {
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith('ga-disable-'));
    setOptedOut(!!cookie);
  }, []);

  const handleOptOut = () => {
    document.cookie = 'ga-disable-GA_MEASUREMENT_ID=true; path=/; max-age=31536000';
    setOptedOut(true);
    alert('You have opted out of Google Analytics tracking.');
  };

  return (
    <div className="privacy-page">
      <Link to="/" className="home-link">← Back to Home</Link>
      <header className="privacy-header">
        <h1>Privacy Policy</h1>
        <p>Last updated: October 9, 2025</p>
      </header>
      <section className="privacy-content">
        <div className="privacy-section">
          <h2>Information We Collect</h2>
          <p>
            We use Google Analytics 4 (GA4), a web analytics service provided by Google LLC, to collect anonymous traffic data on this website. This includes information such as page views, session duration, device information, browser type, and IP addresses. We also track custom events, such as clicks on music service links (Spotify, YouTube Music, Apple Music), to understand user engagement. GA4 uses cookies and similar technologies to collect this data.
          </p>
          <p>
            We do not collect personally identifiable information (PII) such as names, email addresses, or contact details through GA4. All data is aggregated and anonymized. For more details on how Google collects and processes data, please refer to <a href="https://policies.google.com/privacy/partners" target="_blank" rel="noopener noreferrer">Google's Privacy Policy for Partners</a>.
          </p>
        </div>
        <div className="privacy-section">
          <h2>How We Use Your Information</h2>
          <p>
            The data helps us improve our website and content. All data is aggregated and anonymous; we do not collect personally identifiable information.
          </p>
        </div>
        <div className="privacy-section">
          <h2>Third-Party Services</h2>
          <p>
            We use Google Analytics, which processes data according to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>. Music links redirect to external services (Spotify, YouTube Music, Apple Music), each governed by their own privacy policies. We are not responsible for the privacy practices of these third parties.
          </p>
        </div>
        <div className="privacy-section">
          <h2>Your Rights</h2>
          <p>
            Under laws like GDPR and CCPA, you have the right to consent to or opt out of cookie-based tracking. You can opt out of Google Analytics tracking by clicking the button below, which sets a cookie to disable GA4 on this site. You can also manage cookies through your browser settings or use tools like browser extensions. For more options, visit <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out</a>.
          </p>
          {optedOut ? (
            <button 
              disabled
              style={{ padding: '0.5rem 1rem', backgroundColor: '#cccccc', color: '#666666', border: 'none', borderRadius: '4px', cursor: 'default', opacity: 0.5 }}
            >
              You Have Opted Out of Tracking
            </button>
          ) : (
            <button 
              onClick={handleOptOut}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#D4AF37', color: '#000000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Opt Out of Tracking
            </button>
          )}
        </div>
        <div className="privacy-section">
          <h2>Contact Us</h2>
          <p>
            If you have questions, email us at [your-email@example.com].
          </p>
        </div>
      </section>
    </div>
  );
};

export default Privacy;