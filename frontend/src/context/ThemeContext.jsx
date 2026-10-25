import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();
const accents = [
  { id: 'sunset', label: 'Sunset' },
  { id: 'ocean', label: 'Ocean' },
  { id: 'orchid', label: 'Orchid' },
  { id: 'forest', label: 'Forest' },
];

const readPreference = (key, fallback) => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = readPreference('portfolio_theme', '');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });
  const [accent, setAccent] = useState(() => {
    const saved = readPreference('portfolio_accent', 'sunset');
    return accents.some((item) => item.id === saved) ? saved : 'sunset';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('portfolio_theme', theme);
    } catch {
      // The current theme still works when browser storage is unavailable.
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
    try {
      localStorage.setItem('portfolio_accent', accent);
    } catch {
      // The current accent still works when browser storage is unavailable.
    }
  }, [accent]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const cycleAccent = () => {
    setAccent((current) => {
      const currentIndex = accents.findIndex((item) => item.id === current);
      return accents[(currentIndex + 1) % accents.length].id;
    });
  };
  const accentLabel = accents.find((item) => item.id === accent).label;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, accent, accentLabel, cycleAccent }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
