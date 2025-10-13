import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', 'config-error'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://7la2s2m6hxk3vcqn2evjknxaxa0qbosy.lambda-url.us-east-2.on.aws/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Email send failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <Link to="/" className="home-link">← Back to Home</Link>
      <header className="contact-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Send us a message. Name and email are optional - you can provide them if you'd like us to get back to you.</p>
        <p className="form-note">Your message will be sent directly to our email.</p>
      </header>
      <section className="contact-content">
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name <span className="optional">(optional)</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email <span className="optional">(optional)</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </section>
      {submitStatus === 'success' && (
        <div className="status-message success">
          ✅ Message sent successfully! We'll get back to you soon.
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="status-message error">
          ❌ Failed to send message. Please try again later or contact us directly at contact.gracechase@gmail.com
        </div>
      )}
      {submitStatus === 'config-error' && (
        <div className="status-message error">
          ⚠️ Contact form is currently being set up. Please email us directly at contact.gracechase@gmail.com
        </div>
      )}
    </div>
  );
};

export default Contact;