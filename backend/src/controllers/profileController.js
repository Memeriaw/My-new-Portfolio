const fs = require('fs/promises');
const path = require('path');
const Profile = require('../models/Profile');
const { isMongoActive } = require('../config/db');
const { loadStore, saveStore } = require('../config/jsonStore');
const { UPLOAD_DIR } = require('../utils/uploadStorage');
const {
  initialProfile,
  initialSkills,
  initialExperiences,
  initialTestimonials
} = require('../utils/initialData');

const PROFILE_STRING_LIMITS = {
  name: 120,
  title: 160,
  subtitle: 500,
  bio: 4000,
  education: 240,
  university: 240,
  location: 240,
  email: 254,
  telegram: 120,
  telegramUrl: 500,
  linkedin: 240,
  linkedinUrl: 500,
  github: 500,
  photoUrl: 500,
  resumeUrl: 500,
  yearsExperience: 80,
  projectsCompleted: 80,
  clientSatisfaction: 80
};

const sanitizeProfileUpdate = (body) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Profile update must be an object.' };
  }

  const update = {};
  if (body.profile !== undefined) {
    if (!body.profile || typeof body.profile !== 'object' || Array.isArray(body.profile)) {
      return { error: 'Profile details must be an object.' };
    }
    update.profile = {};
    for (const [key, value] of Object.entries(body.profile)) {
      if (key === 'availableForWork') {
        if (typeof value !== 'boolean') return { error: 'Availability must be true or false.' };
        update.profile[key] = value;
        continue;
      }
      const limit = PROFILE_STRING_LIMITS[key];
      if (!limit) return { error: `Profile field "${key}" cannot be changed through this form.` };
      if (typeof value !== 'string' || value.length > limit) {
        return { error: `${key} must be a string with at most ${limit} characters.` };
      }
      const cleanValue = value.trim();
      if (key === 'email' && cleanValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanValue)) {
        return { error: 'A valid email address is required.' };
      }
      if (['telegramUrl', 'linkedinUrl', 'github'].includes(key) && cleanValue) {
        try {
          const url = new URL(cleanValue);
          if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid URL protocol');
        } catch {
          return { error: `${key} must be a valid HTTP or HTTPS URL.` };
        }
      }
      if (key === 'photoUrl' && cleanValue) {
        if (cleanValue.startsWith('/uploads/')) {
          if (!/^\/uploads\/profile-[\da-f-]+\.(jpg|png|webp)$/i.test(cleanValue)) {
            return { error: 'photoUrl must be a valid uploaded profile image path.' };
          }
        } else {
          try {
            const url = new URL(cleanValue);
            if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid URL protocol');
          } catch {
            return { error: 'photoUrl must be an uploaded image path or valid HTTP/HTTPS URL.' };
          }
        }
      }
      if (key === 'resumeUrl' && cleanValue && cleanValue.startsWith('//')) {
        return { error: 'resumeUrl must be a local path or valid HTTP/HTTPS URL.' };
      }
      if (key === 'resumeUrl' && cleanValue && !cleanValue.startsWith('/')) {
        try {
          const url = new URL(cleanValue);
          if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid URL protocol');
        } catch {
          return { error: 'resumeUrl must be a local path or valid HTTP/HTTPS URL.' };
        }
      }
      update.profile[key] = cleanValue;
    }
  }

  if (body.skills !== undefined) {
    if (!Array.isArray(body.skills) || body.skills.length > 100) {
      return { error: 'Skills must be a list containing at most 100 entries.' };
    }
    update.skills = [];
    for (const skill of body.skills) {
      if (!skill || typeof skill !== 'object' || Array.isArray(skill)
        || typeof skill.name !== 'string' || !skill.name.trim() || skill.name.length > 80
        || typeof skill.category !== 'string' || skill.category.length > 80
        || typeof skill.icon !== 'string' || skill.icon.length > 80
        || !Number.isInteger(skill.level) || skill.level < 0 || skill.level > 100) {
        return { error: 'Each skill must include a name, category, icon, and level from 0 to 100.' };
      }
      update.skills.push({
        name: skill.name.trim(),
        category: skill.category.trim(),
        icon: skill.icon.trim(),
        level: skill.level
      });
    }
  }

  if (!Object.keys(update).length) return { error: 'No profile changes were provided.' };
  return { update };
};

const hasValidImageSignature = async (filePath, mimeType) => {
  const handle = await fs.open(filePath, 'r');
  try {
    const header = Buffer.alloc(12);
    const { bytesRead } = await handle.read(header, 0, header.length, 0);
    const data = header.subarray(0, bytesRead);
    if (mimeType === 'image/jpeg') return data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
    if (mimeType === 'image/png') return data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    if (mimeType === 'image/webp') {
      return data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WEBP';
    }
    return false;
  } finally {
    await handle.close();
  }
};

const hasValidPdfSignature = async (filePath) => {
  const handle = await fs.open(filePath, 'r');
  try {
    const header = Buffer.alloc(5);
    const { bytesRead } = await handle.read(header, 0, header.length, 0);
    return header.subarray(0, bytesRead).toString('ascii', 0, 5) === '%PDF-';
  } finally {
    await handle.close();
  }
};

const uploadProfilePhoto = async (req, res, next) => {
  const uploadedFile = req.file;
  if (!uploadedFile) {
    return res.status(400).json({ success: false, message: 'Choose a JPEG, PNG, or WebP image to upload.' });
  }

  let profileSaved = false;
  try {
    if (!await hasValidImageSignature(uploadedFile.path, uploadedFile.mimetype)) {
      await fs.unlink(uploadedFile.path);
      return res.status(400).json({ success: false, message: 'The uploaded file is not a valid image.' });
    }

    const store = isMongoActive() ? null : loadStore();
    const existingProfile = isMongoActive()
      ? await Profile.findOne()
      : store.profile;
    const oldPhotoUrl = existingProfile?.profile?.photoUrl;
    const photoUrl = `/uploads/${path.basename(uploadedFile.filename)}`;

    if (isMongoActive()) {
      const doc = existingProfile || await Profile.create({
        profile: initialProfile,
        skills: initialSkills,
        experiences: initialExperiences,
        testimonials: initialTestimonials
      });
      doc.profile = { ...(doc.profile || initialProfile), photoUrl };
      await doc.save();
    } else {
      const current = store.profile || {
        profile: initialProfile,
        skills: initialSkills,
        experiences: initialExperiences,
        testimonials: initialTestimonials
      };
      store.profile = { ...current, profile: { ...(current.profile || initialProfile), photoUrl } };
      if (!saveStore(store)) throw new Error('Could not save the profile photo details.');
    }
    profileSaved = true;

    if (typeof oldPhotoUrl === 'string' && oldPhotoUrl.startsWith('/uploads/profile-')) {
      const oldPhotoPath = path.join(UPLOAD_DIR, path.basename(oldPhotoUrl));
      if (oldPhotoPath !== uploadedFile.path) {
        await fs.unlink(oldPhotoPath).catch(error => {
          if (error.code !== 'ENOENT') {
            console.error('Could not remove the previous profile photo:', error.message);
          }
        });
      }
    }

    return res.status(200).json({ success: true, photoUrl });
  } catch (err) {
    if (!profileSaved) {
      await fs.unlink(uploadedFile.path).catch(cleanupError => {
        if (cleanupError.code !== 'ENOENT') {
          console.error('Could not remove an unsaved profile photo:', cleanupError.message);
        }
      });
    }
    return next(err);
  }
};

const uploadResume = async (req, res, next) => {
  const uploadedFile = req.file;
  if (!uploadedFile) {
    return res.status(400).json({ success: false, message: 'Choose a PDF resume to upload.' });
  }

  let profileSaved = false;
  try {
    if (!await hasValidPdfSignature(uploadedFile.path)) {
      await fs.unlink(uploadedFile.path);
      return res.status(400).json({ success: false, message: 'The uploaded file is not a valid PDF.' });
    }

    const store = isMongoActive() ? null : loadStore();
    const existingProfile = isMongoActive() ? await Profile.findOne() : store.profile;
    const oldResumeUrl = existingProfile?.profile?.resumeUrl;
    const resumeUrl = `/uploads/${path.basename(uploadedFile.filename)}`;

    if (isMongoActive()) {
      const doc = existingProfile || await Profile.create({
        profile: initialProfile,
        skills: initialSkills,
        experiences: initialExperiences,
        testimonials: initialTestimonials
      });
      doc.profile = { ...(doc.profile || initialProfile), resumeUrl };
      await doc.save();
    } else {
      const current = store.profile || {
        profile: initialProfile,
        skills: initialSkills,
        experiences: initialExperiences,
        testimonials: initialTestimonials
      };
      store.profile = { ...current, profile: { ...(current.profile || initialProfile), resumeUrl } };
      if (!saveStore(store)) throw new Error('Could not save the resume link details.');
    }
    profileSaved = true;

    if (typeof oldResumeUrl === 'string' && /^\/uploads\/resume-[\da-f-]+\.(pdf)$/i.test(oldResumeUrl)) {
      const oldResumePath = path.join(UPLOAD_DIR, path.basename(oldResumeUrl));
      if (oldResumePath !== uploadedFile.path) {
        await fs.unlink(oldResumePath).catch(error => {
          if (error.code !== 'ENOENT') {
            console.error('Could not remove the previous resume:', error.message);
          }
        });
      }
    }

    return res.status(200).json({ success: true, resumeUrl });
  } catch (err) {
    if (!profileSaved) {
      await fs.unlink(uploadedFile.path).catch(cleanupError => {
        if (cleanupError.code !== 'ENOENT') {
          console.error('Could not remove an unsaved resume:', cleanupError.message);
        }
      });
    }
    return next(err);
  }
};

const deleteProfilePhoto = async (req, res, next) => {
  try {
    const store = isMongoActive() ? null : loadStore();
    const doc = isMongoActive() ? await Profile.findOne() : null;
    const current = isMongoActive() ? doc : store.profile;
    const oldPhotoUrl = current?.profile?.photoUrl;
    const photoUrl = initialProfile.photoUrl || '/images/profile.jpg';

    if (isMongoActive()) {
      const profileDoc = doc || await Profile.create({
        profile: initialProfile,
        skills: initialSkills,
        experiences: initialExperiences,
        testimonials: initialTestimonials
      });
      profileDoc.profile = { ...(profileDoc.profile || initialProfile), photoUrl };
      await profileDoc.save();
    } else {
      const profileData = current || {
        profile: initialProfile,
        skills: initialSkills,
        experiences: initialExperiences,
        testimonials: initialTestimonials
      };
      store.profile = {
        ...profileData,
        profile: { ...(profileData.profile || initialProfile), photoUrl }
      };
      if (!saveStore(store)) throw new Error('Could not save the profile photo removal.');
    }

    if (typeof oldPhotoUrl === 'string' && /^\/uploads\/profile-[\da-f-]+\.(jpg|png|webp)$/i.test(oldPhotoUrl)) {
      const oldPhotoPath = path.join(UPLOAD_DIR, path.basename(oldPhotoUrl));
      try {
        await fs.unlink(oldPhotoPath);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          console.error('Profile photo was unlinked from the profile but its file could not be removed:', error.message);
          return res.status(200).json({
            success: true,
            photoUrl,
            cleanupWarning: 'The photo was removed from your profile, but its stored file could not be deleted.'
          });
        }
      }
    }

    return res.status(200).json({ success: true, photoUrl });
  } catch (err) {
    return next(err);
  }
};

const deleteResume = async (req, res, next) => {
  try {
    const store = isMongoActive() ? null : loadStore();
    const doc = isMongoActive() ? await Profile.findOne() : null;
    const current = isMongoActive() ? doc : store.profile;
    const oldResumeUrl = current?.profile?.resumeUrl;
    const resumeUrl = initialProfile.resumeUrl || '/resume.pdf';

    if (isMongoActive()) {
      const profileDoc = doc || await Profile.create({
        profile: initialProfile,
        skills: initialSkills,
        experiences: initialExperiences,
        testimonials: initialTestimonials
      });
      profileDoc.profile = { ...(profileDoc.profile || initialProfile), resumeUrl };
      await profileDoc.save();
    } else {
      const profileData = current || {
        profile: initialProfile,
        skills: initialSkills,
        experiences: initialExperiences,
        testimonials: initialTestimonials
      };
      store.profile = {
        ...profileData,
        profile: { ...(profileData.profile || initialProfile), resumeUrl }
      };
      if (!saveStore(store)) throw new Error('Could not save the resume removal.');
    }

    if (typeof oldResumeUrl === 'string' && /^\/uploads\/resume-[\da-f-]+\.(pdf)$/i.test(oldResumeUrl)) {
      const oldResumePath = path.join(UPLOAD_DIR, path.basename(oldResumeUrl));
      try {
        await fs.unlink(oldResumePath);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          console.error('Resume was removed from the profile but its file could not be deleted:', error.message);
          return res.status(200).json({
            success: true,
            resumeUrl,
            cleanupWarning: 'The resume was removed from your profile, but its uploaded file could not be deleted.'
          });
        }
      }
    }

    return res.status(200).json({ success: true, resumeUrl });
  } catch (err) {
    return next(err);
  }
};

// @desc    Get complete portfolio profile, skills, experiences & testimonials
// @route   GET /api/profile
// @access  Public
const getProfile = async (req, res, next) => {
  try {
    if (isMongoActive()) {
      const doc = await Profile.findOne();
      if (doc) {
        return res.status(200).json({
          profile: { ...initialProfile, ...(doc.profile || {}) },
          skills: doc.skills || initialSkills,
          experiences: doc.experiences || initialExperiences,
          testimonials: doc.testimonials || initialTestimonials
        });
      }
    } else {
      const store = loadStore();
      if (store.profile) {
        return res.status(200).json({
          ...store.profile,
          profile: { ...initialProfile, ...(store.profile.profile || {}) }
        });
      }
    }

    // Default fallback
    return res.status(200).json({
      profile: initialProfile,
      skills: initialSkills,
      experiences: initialExperiences,
      testimonials: initialTestimonials
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update portfolio profile details
// @route   PUT /api/profile
// @access  Private (Admin)
const updateProfile = async (req, res, next) => {
  try {
    const { update, error } = sanitizeProfileUpdate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    if (isMongoActive()) {
      let doc = await Profile.findOne();
      if (!doc) {
        doc = await Profile.create({
          profile: { ...initialProfile, ...(update.profile || {}) },
          skills: update.skills || initialSkills,
          experiences: initialExperiences,
          testimonials: initialTestimonials
        });
      } else {
        if (update.profile) doc.profile = { ...(doc.profile || {}), ...update.profile };
        if (update.skills) doc.skills = update.skills;
        await doc.save();
      }
      return res.status(200).json({ success: true, data: doc });
    } else {
      const store = loadStore();
      const current = store.profile || {
        profile: initialProfile,
        skills: initialSkills,
        experiences: initialExperiences,
        testimonials: initialTestimonials
      };
      store.profile = { ...current };
      if (update.profile) store.profile.profile = { ...(current.profile || initialProfile), ...update.profile };
      if (update.skills) store.profile.skills = update.skills;
      saveStore(store);
      return res.status(200).json({ success: true, data: store.profile });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
  uploadResume,
  deleteResume
};
