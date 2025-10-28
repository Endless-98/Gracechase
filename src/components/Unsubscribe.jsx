import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './Unsubscribe.css';

const Unsubscribe = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'not-found' | 'error'
  const [searchParams] = useSearchParams();

  // Simplest approach without public DB permissions:
  // Send an unsubscribe request to our email handler Lambda, and we'll process removal server-side.
  const unsubscribeByEmail = async (targetEmail) => {
    const endpoint = 'https://eykveoan7cjc745m7twnh2hof40raaok.lambda-url.us-east-1.on.aws/';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Unsubscribe Request',
          email: (targetEmail || '').trim().toLowerCase(),
          message: 'Please unsubscribe this address from the Gracechase newsletter and remove any associated records.'
        })
      });
      if (!res.ok) throw new Error('Unsubscribe email failed');
      return 'success';
    } catch (e) {
      console.error('Unsubscribe request failed:', e);
      return 'error';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    try {
      const result = await unsubscribeByEmail(email);
      setStatus(result);
    } catch (e) {
      console.error('Unsubscribe failed:', e);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-unsubscribe when an email query parameter is provided
  useEffect(() => {
  const qEmail = searchParams.get('email');
    if (!qEmail) return;
  setEmail(qEmail);
    let cancelled = false;
    (async () => {
      setIsSubmitting(true);
      setStatus(null);
      try {
        const result = await unsubscribeByEmail(qEmail);
        if (!cancelled) setStatus(result);
      } catch (e) {
        console.error('Auto-unsubscribe failed:', e);
        if (!cancelled) setStatus('error');
      } finally {
        if (!cancelled) setIsSubmitting(false);
        // Remove the email query from the URL to avoid leaving PII in the address bar/history
        try {
          const base = window.location.href.split('?')[0];
          // Preserve hash route base (e.g., http://host/#/unsubscribe)
          const withoutQuery = base;
          window.history.replaceState(null, '', withoutQuery);
        } catch {}
      }
    })();
    return () => { cancelled = true; };
  }, [searchParams]);

  return (
    <div className="unsubscribe-page">
      <div className="unsubscribe-content-wrapper">
        <Link to="/" className="home-link">← Back to Home</Link>

        <header className="unsubscribe-header">
          <h1>Unsubscribe</h1>
          <p>Enter your email to stop receiving updates from Gracechase. You can resubscribe anytime.</p>
        </header>

        <section className="unsubscribe-form-section">
          <form onSubmit={handleSubmit} className="unsubscribe-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Processing…' : 'Unsubscribe'}
            </button>
          </form>

          {status === 'success' && (
            <div className="status-message success">
              ✅ You’ve been unsubscribed. If you change your mind, you can resubscribe anytime.
            </div>
          )}
          {/* No direct DB check; requests are emailed for processing */}
          {status === 'error' && (
            <div className="status-message error">
              ❌ Something went wrong. Please try again later or contact us.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Unsubscribe;
