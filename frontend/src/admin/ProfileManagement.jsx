import React, { useEffect, useState } from 'react';
import { CheckCircle2, Save, Trash2, UserRound } from 'lucide-react';
import { api, getAssetUrl } from '../services/api';
import { usePortfolioProfile } from '../context/ProfileContext';

const emptyProfile = {
  name: '',
  title: '',
  subtitle: '',
  bio: '',
  photoUrl: '',
  email: '',
  telegramUrl: '',
  linkedinUrl: '',
  github: '',
  resumeUrl: ''
};
const defaultPhotoUrl = '/images/profile.jpg';

const validateProfile = (profile, skills) => {
  if (!profile.name.trim() || !profile.title.trim() || !profile.bio.trim()) {
    return 'Name, professional headline, and biography are required.';
  }
  if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    return 'Enter a valid email address.';
  }

  const urlFields = ['telegramUrl', 'linkedinUrl', 'github', 'resumeUrl'];
  for (const key of urlFields) {
    const value = profile[key].trim();
    if (!value || (key === 'resumeUrl' && value.startsWith('/'))) continue;
    try {
      const url = new URL(value);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid protocol');
    } catch {
      return `Enter a valid web link for ${key.replace('Url', ' URL')}.`;
    }
  }
  if (skills.some(skill => skill.length > 80)) return 'Each skill must be 80 characters or fewer.';
  return '';
};

export const ProfileManagement = () => {
  const { setPortfolioData } = usePortfolioProfile();
  const [profile, setProfile] = useState(emptyProfile);
  const [skillsText, setSkillsText] = useState('');
  const [originalSkills, setOriginalSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;
    api.getAdminProfile()
      .then(data => {
        if (!active) return;
        const values = data.profile || {};
        setProfile(Object.fromEntries(
          Object.keys(emptyProfile).map(key => [key, values[key] || ''])
        ));
        setOriginalSkills(data.skills || []);
        setSkillsText((data.skills || []).map(skill => typeof skill === 'string' ? skill : skill.name).filter(Boolean).join(', '));
      })
      .catch(requestError => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const handleChange = (event) => {
    setProfile(current => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
    setSuccess('');
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Choose a JPEG, PNG, or WebP image.');
      setSuccess('');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('The profile photo must be 5 MB or smaller.');
      setSuccess('');
      return;
    }

    setUploadingPhoto(true);
    setError('');
    setSuccess('');
    try {
      const result = await api.uploadProfilePhoto(file);
      setProfile(current => ({ ...current, photoUrl: result.photoUrl }));
      setPortfolioData(current => ({
        ...current,
        profile: { ...current.profile, photoUrl: result.photoUrl }
      }));
      setSuccess('Profile photo uploaded.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotoDelete = async () => {
    setUploadingPhoto(true);
    setError('');
    setSuccess('');
    try {
      const result = await api.deleteProfilePhoto();
      setProfile(current => ({ ...current, photoUrl: result.photoUrl }));
      setPortfolioData(current => ({
        ...current,
        profile: { ...current.profile, photoUrl: result.photoUrl }
      }));
      if (result.cleanupWarning) {
        setError(result.cleanupWarning);
      } else {
        setSuccess('Profile photo removed. The default image is now being used.');
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleResumeChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
      setError('Choose a PDF resume file.');
      setSuccess('');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('The resume PDF must be 10 MB or smaller.');
      setSuccess('');
      return;
    }

    setUploadingResume(true);
    setError('');
    setSuccess('');
    try {
      const result = await api.uploadResume(file);
      setProfile(current => ({ ...current, resumeUrl: result.resumeUrl }));
      setPortfolioData(current => ({
        ...current,
        profile: { ...current.profile, resumeUrl: result.resumeUrl }
      }));
      setSuccess('Resume uploaded successfully.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUploadingResume(false);
    }
  };

  const handleResumeDelete = async () => {
    setUploadingResume(true);
    setError('');
    setSuccess('');
    try {
      const result = await api.deleteResume();
      setProfile(current => ({ ...current, resumeUrl: result.resumeUrl }));
      setPortfolioData(current => ({
        ...current,
        profile: { ...current.profile, resumeUrl: result.resumeUrl }
      }));
      if (result.cleanupWarning) {
        setError(result.cleanupWarning);
      } else {
        setSuccess('Resume removed. The default resume link is now active.');
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const skillNames = skillsText.split(',').map(skill => skill.trim()).filter(Boolean);
    const skills = skillNames.map(name => {
      const existing = originalSkills.find(skill => (typeof skill === 'string' ? skill : skill.name) === name);
      return typeof existing === 'object' && existing !== null
        ? { ...existing, name }
        : { name, category: 'systems', level: 80, icon: 'Code2' };
    });
    const validationError = validateProfile(profile, skillNames);
    if (validationError) {
      setError(validationError);
      setSuccess('');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const result = await api.updateProfile({
        profile: Object.fromEntries(Object.entries(profile).map(([key, value]) => [key, value.trim()])),
        skills
      });
      setPortfolioData(current => ({ ...current, ...result.data }));
      setSuccess('Profile changes saved.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <section className="admin-page-heading">
        <div className="admin-stat-icon blue"><UserRound size={20} /></div>
        <div>
          <span className="admin-eyebrow">Public portfolio content</span>
          <h1>Profile management</h1>
          <p>Update the profile details and links shown across your portfolio.</p>
        </div>
      </section>

      {error && <div className="admin-alert error" role="alert">{error}</div>}
      {success && <div className="admin-alert success" role="status"><CheckCircle2 size={18} />{success}</div>}

      {loading ? (
        <div className="admin-panel admin-state">Loading profile from the server…</div>
      ) : (
        <form className="admin-panel admin-profile-form" onSubmit={handleSubmit}>
          <div className="admin-panel-heading">
            <div>
              <span className="admin-eyebrow">Basic information</span>
              <h2>Your profile</h2>
            </div>
          </div>

          <div className="admin-photo-field">
            <img
              className="admin-photo-preview"
              src={getAssetUrl(profile.photoUrl || '/images/profile.jpg')}
              alt={`${profile.name || 'Profile'} photo preview`}
            />
            <label className="admin-field">
              <span>Profile photo</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                disabled={uploadingPhoto}
              />
              <small>JPEG, PNG, or WebP. Maximum 5 MB. Uploading saves the photo immediately.</small>
              {profile.photoUrl && profile.photoUrl !== defaultPhotoUrl && (
                <button
                  className="btn btn-outline admin-photo-remove"
                  type="button"
                  onClick={handlePhotoDelete}
                  disabled={uploadingPhoto}
                >
                  <Trash2 size={16} /> {uploadingPhoto ? 'Removing…' : 'Remove photo'}
                </button>
              )}
            </label>
          </div>

          <div className="admin-form-grid">
            <label className="admin-field">
              <span>Name <b>*</b></span>
              <input name="name" value={profile.name} onChange={handleChange} maxLength={120} required />
            </label>
            <label className="admin-field">
              <span>Professional headline <b>*</b></span>
              <input name="title" value={profile.title} onChange={handleChange} maxLength={160} required />
            </label>
            <label className="admin-field admin-field-wide">
              <span>Introductory subtitle</span>
              <textarea name="subtitle" value={profile.subtitle} onChange={handleChange} rows={3} maxLength={500} />
            </label>
            <label className="admin-field admin-field-wide">
              <span>Biography <b>*</b></span>
              <textarea name="bio" value={profile.bio} onChange={handleChange} rows={6} maxLength={4000} required />
            </label>
          </div>

          <div className="admin-panel-heading admin-profile-section-heading">
            <div>
              <span className="admin-eyebrow">How people can reach you</span>
              <h2>Contact & social links</h2>
            </div>
          </div>
          <div className="admin-form-grid">
            <label className="admin-field">
              <span>Email</span>
              <input type="email" name="email" value={profile.email} onChange={handleChange} maxLength={254} />
            </label>
            <label className="admin-field">
              <span>Telegram URL</span>
              <input type="url" name="telegramUrl" value={profile.telegramUrl} onChange={handleChange} maxLength={500} />
            </label>
            <label className="admin-field">
              <span>LinkedIn URL</span>
              <input type="url" name="linkedinUrl" value={profile.linkedinUrl} onChange={handleChange} maxLength={500} />
            </label>
            <label className="admin-field">
              <span>GitHub URL</span>
              <input type="url" name="github" value={profile.github} onChange={handleChange} maxLength={500} />
            </label>
            <label className="admin-field admin-field-wide">
              <span>Resume link</span>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <input name="resumeUrl" value={profile.resumeUrl} onChange={handleChange} maxLength={500} placeholder="/resume.pdf or https://…" />
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <label className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0 }}>
                    {uploadingResume ? 'Uploading…' : 'Upload PDF resume'}
                    <input type="file" accept="application/pdf" onChange={handleResumeChange} hidden />
                  </label>
                  {profile.resumeUrl && profile.resumeUrl !== '/resume.pdf' && (
                    <button className="btn btn-outline" type="button" onClick={handleResumeDelete} disabled={uploadingResume}>
                      Remove resume
                    </button>
                  )}
                </div>
              </div>
            </label>
            <label className="admin-field admin-field-wide">
              <span>Skills <small>Separate entries with commas</small></span>
              <textarea value={skillsText} onChange={event => { setSkillsText(event.target.value); setError(''); setSuccess(''); }} rows={3} maxLength={4000} />
            </label>
          </div>

          <div className="admin-form-footer">
            <span>{uploadingPhoto || uploadingResume ? 'Updating your portfolio files…' : 'Your photo and resume files are stored on the portfolio server.'}</span>
            <button className="btn btn-primary" type="submit" disabled={saving || uploadingPhoto || uploadingResume}>
              <Save size={17} /> {saving ? 'Saving…' : 'Save profile'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
