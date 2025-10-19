import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './Unsubscribe.css';

const Unsubscribe = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'not-found' | 'error'
  const [searchParams] = useSearchParams();

  // Helper: unsubscribe all records matching this email
  const unsubscribeByEmail = async (targetEmail) => {
    const { generateClient } = await import('aws-amplify/data');
    const client = generateClient();
    const normalized = (targetEmail || '').trim().toLowerCase();
    const { data: records } = await client.models.NewsletterSignup.list({
      filter: { email: { eq: normalized } },
    });

    if (!records || records.length === 0) {
      return 'not-found';
    }
  // Mark deletion timestamp; scheduled cleaner (and/or TTL if set server-side) will remove leftovers
  const now = Date.now();
  await Promise.all(records.map((rec) => client.models.NewsletterSignup.update({ id: rec.id, deletedAt: String(now) })));
    // Attempt immediate deletes; if they fail the scheduled cleaner will remove these within 24 hours
    try {
      await Promise.all(records.map((rec) => client.models.NewsletterSignup.delete({ id: rec.id })));
    } catch (e) {
      // ignore: fallback cleaner will pick up marked records
      console.warn('Immediate delete failed; marked records will expire via cleaner', e);
    }
    return 'success';
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
          {status === 'not-found' && (
            <div className="status-message warning">
              We didn’t find that email in our list. Please check the address or try another.
            </div>
          )}
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
