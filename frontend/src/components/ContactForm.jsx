import React, { useState } from 'react';
import { api } from '../services/api';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '' // anti-spam bot trap
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please enter your name.';
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.subject.trim()) errs.subject = 'Please provide a subject.';
    if (!formData.message.trim()) {
      errs.message = 'Please provide a message.';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters long.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Check spam bot honeypot
    if (formData.honeypot) {
      // Silently ignore bot submission
      setStatusMessage({ type: 'success', text: 'Thank you! Your message has been sent.' });
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);

    try {
      const response = await api.submitContact({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });

      setStatusMessage({
        type: response.emailNotificationSent === false ? 'warning' : 'success',
        text: response.message || 'Thank you! Your message has been sent successfully. I will get back to you shortly.'
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        honeypot: ''
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to send message. Please try again or reach out directly on Telegram/LinkedIn.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card" noValidate>
      {/* Status banner */}
      {statusMessage && (
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: statusMessage.type === 'success'
              ? 'rgba(16, 185, 129, 0.12)'
              : statusMessage.type === 'warning'
                ? 'rgba(245, 158, 11, 0.12)'
                : 'rgba(239, 68, 68, 0.12)',
            border: `1px solid ${
              statusMessage.type === 'success'
                ? 'var(--status-success)'
                : statusMessage.type === 'warning'
                  ? 'var(--status-warning)'
                  : 'var(--status-error)'
            }`,
            color: statusMessage.type === 'success'
              ? 'var(--status-success)'
              : statusMessage.type === 'warning'
                ? 'var(--status-warning)'
                : 'var(--status-error)'
          }}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span style={{ fontSize: '0.92rem' }}>{statusMessage.text}</span>
        </div>
      )}

      {/* Hidden honeypot field for bot spam defense */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <label htmlFor="website-hp">Leave this empty</label>
        <input
          type="text"
          id="website-hp"
          name="honeypot"
          value={formData.honeypot}
          onChange={handleChange}
          tabIndex="-1"
          autoComplete="off"
        />
      </div>

      {/* Name & Email Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="form-group">
          <label htmlFor="contact-name" className="form-label">
            Your Name <span style={{ color: 'var(--status-error)' }}>*</span>
          </label>
          <input
            type="text"
            id="contact-name"
            name="name"
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="e.g. John Doe"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="contact-email" className="form-label">
            Email Address <span style={{ color: 'var(--status-error)' }}>*</span>
          </label>
          <input
            type="email"
            id="contact-email"
            name="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="e.g. john@company.com"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>
      </div>

      {/* Subject */}
      <div className="form-group">
        <label htmlFor="contact-subject" className="form-label">
          Subject <span style={{ color: 'var(--status-error)' }}>*</span>
        </label>
        <input
          type="text"
          id="contact-subject"
          name="subject"
          className={`form-input ${errors.subject ? 'error' : ''}`}
          placeholder="e.g. Project Inquiry or Full-Stack Opportunity"
          value={formData.subject}
          onChange={handleChange}
        />
        {errors.subject && <span className="form-error">{errors.subject}</span>}
      </div>

      {/* Message */}
      <div className="form-group">
        <label htmlFor="contact-message" className="form-label">
          Message <span style={{ color: 'var(--status-error)' }}>*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          className={`form-textarea ${errors.message ? 'error' : ''}`}
          placeholder="Describe your project, timeline, or how we can collaborate..."
          value={formData.message}
          onChange={handleChange}
        />
        {errors.message && <span className="form-error">{errors.message}</span>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary"
        style={{ width: '100%', marginTop: '0.5rem' }}
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Sending Message...</span>
          </>
        ) : (
          <>
            <Send size={18} />
            <span>Send Message</span>
          </>
        )}
      </button>
    </form>
  );
};
