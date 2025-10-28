import { useState } from 'react';
import { Link } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import amplifyOutputs from '../../amplify_outputs/amplify_outputs.json';
import './NewsletterSignup.css';

const NewsletterSignup = () => {
  // Feature flag: disable confirmation email send until SES production access is granted
  const shouldSendConfirmation = import.meta.env.VITE_SEND_CONFIRM_EMAIL === 'true';
  const [formData, setFormData] = useState({
    email: '',
    interests: [],
    acceptTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error'
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((formData.email || '').trim());
  const client = generateClient();
  // Determine if the deployed GraphQL API supports the numeric ttl field
  const supportsTTL = !!(
    amplifyOutputs?.data?.model_introspection?.models?.NewsletterSignup?.fields?.ttl
  );

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

    try {
      const normalizedEmail = (formData.email || '').trim().toLowerCase();
      // Create NewsletterSignup directly via AppSync (public IAM auth)
      const ttlDays = parseInt(import.meta.env.VITE_TTL_INACTIVE_DAYS || '425', 10);
      const ttlSeconds = Math.floor(Date.now() / 1000) + (isNaN(ttlDays) ? 425 : ttlDays) * 24 * 60 * 60;
      const mutation = supportsTTL
        ? /* GraphQL */ `
          mutation CreateNewsletterSignup($input: CreateNewsletterSignupInput!) {
            createNewsletterSignup(input: $input) {
              id
              email
              interests
              createdAt
              ttl
            }
          }
        `
        : /* GraphQL */ `
          mutation CreateNewsletterSignup($input: CreateNewsletterSignupInput!) {
            createNewsletterSignup(input: $input) {
              id
              email
              interests
              createdAt
            }
          }
        `;
      await client.graphql({
        query: mutation,
        variables: {
          input: {
            email: normalizedEmail,
            interests: formData.interests,
            ...(supportsTTL ? { ttl: ttlSeconds } : {}),
          },
        },
        authMode: 'iam',
      });
      setStatus('success');
      setFormData({
        email: '',
        interests: [],
        acceptTerms: false
      });

      // Track newsletter signup conversion
      if (window.twq) {
        twq('event', 'tw-odx0z-odx10', {
          value: null,
          currency: null,
          content_name: 'Newsletter Signup',
          content_category: 'Newsletter',
          conversion_id: 'newsletter_signup'
        });
      }
    } catch (error) {
  if (import.meta.env.DEV) console.error('Signup failed:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="newsletter-page">
      <div className="newsletter-content-wrapper">
        <Link to="/" className="home-link">← Back to Home</Link>

        <header className="newsletter-header">
          <h1>Stay In Touch</h1>
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

            {/* Bot honeypot removed per request */}

            <div className="form-group">
              <label>What interests you? <span className="optional">(select at least one)</span></label>
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

            <button
              type="submit"
              className="submit-btn"
              disabled={
                isSubmitting ||
                !formData.acceptTerms ||
                formData.interests.length === 0 ||
                !isEmailValid
              }
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe to Updates'}
            </button>
            {/* Status messaging sits directly under the submit button inside the form */}
            <div aria-live="polite" aria-atomic="true">
              {status === 'success' && (
                <div className="status-message success">
                  Thanks for subscribing! We can't wait to share our next updates with you!
                </div>
              )}
              {status === 'error' && (
                <div className="status-message error">
                  Something went wrong. Please try again or contact us directly.
                </div>
              )}
            </div>

            {/* Inline contact link at the very bottom, same styling as footer links */}
            <p className="contact-inline">
              Need help or have a question? <Link to="/contact">Contact us</Link>
            </p>
          </form>
          {/* Turnstile removed per request */}
        </section>
      </div>
    </div>
  );
};

export default NewsletterSignup;