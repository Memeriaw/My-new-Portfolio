import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  initialProfile,
  initialSkills,
  initialExperiences,
  initialTestimonials
} from '../data/initialData';

const initialPortfolioData = {
  profile: initialProfile,
  skills: initialSkills,
  experiences: initialExperiences,
  testimonials: initialTestimonials
};

const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState(initialPortfolioData);

  useEffect(() => {
    let active = true;
    api.getProfile()
      .then(data => {
        if (active && data && typeof data === 'object') {
          setPortfolioData(current => ({ ...current, ...data }));
        }
      })
      .catch(error => console.error('Could not load portfolio profile:', error));
    return () => { active = false; };
  }, []);

  return (
    <ProfileContext.Provider value={{ portfolioData, setPortfolioData }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const usePortfolioProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('usePortfolioProfile must be used within ProfileProvider.');
  return context;
};
