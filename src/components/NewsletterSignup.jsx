import { useState } from 'react';
import { Link } from 'react-router-dom';
import './NewsletterSignup.css';

const NewsletterSignup = () => {
  const [formData, setFormData] = useState({
    email: '',
    interests: [],
    acceptTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error'

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'interests') {
        setFormData(prev => ({
          ...prev,
          interests: checked
            ? [...prev.interests, value]
            : prev.interests.filter(interest => interest !== value)
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    // Simulate successful submission
    setTimeout(() => {
      setStatus('success');
      setFormData({
        email: '',
        interests: [],
        acceptTerms: false
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="newsletter-page">
      <div className="newsletter-content-wrapper">
        <Link to="/" className="home-link">← Back to Home</Link>

        <header className="newsletter-header">
          <h1>Stay Connected</h1>
          <p>Join our community and be the first to know about new releases, behind-the-scenes content, and inspiration from Gracechase.</p>
        </header>

        <section className="newsletter-form-section">
          <form onSubmit={handleSubmit} className="newsletter-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>What interests you? <span className="optional">(select all that apply)</span></label>
              <div className="checkbox-group">
                <span className="option-text">New music releases</span>
                <input
                  type="checkbox"
                  name="interests"
                  className="checkbox"
                  value="new-releases"
                  checked={formData.interests.includes('new-releases')}
                  onChange={handleChange}
                />
              </div>
              <div className="checkbox-group">
                <span className="option-text">Blog posts</span>
                <input
                  type="checkbox"
                  name="interests"
                  className="checkbox"
                  value="blog-posts"
                  checked={formData.interests.includes('blog-posts')}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="terms-label">
                <div className="terms-text">I agree to receive emails from Gracechase and understand I can unsubscribe at any time. View our <a href="/privacy" target="_blank">Privacy Policy</a>.</div>
                <input
                  type="checkbox"
                  name="acceptTerms"
                  className="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting || !formData.acceptTerms}>
              {isSubmitting ? 'Subscribing...' : 'Subscribe to Updates'}
            </button>
          </form>

          {status === 'success' && (
            <div className="status-message success">
              ✅ Thanks for subscribing! Check your email to confirm your subscription.
            </div>
          )}
          {status === 'error' && (
            <div className="status-message error">
              ❌ Something went wrong. Please try again or contact us directly.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default NewsletterSignup;