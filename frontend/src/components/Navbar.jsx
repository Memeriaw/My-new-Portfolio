import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Sun,
  Moon,
  Menu,
  X,
  Briefcase,
  User,
  Mail,
  Layers,
  Palette
} from 'lucide-react';

export const Navbar = () => {
  const { theme, toggleTheme, accentLabel, cycleAccent } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/" className="nav-logo" onClick={closeMobile}>
          <img src="/images/brand-photo.png" alt="" className="nav-logo-icon" />
          <span>Memeriaw<span className="gradient-text">.dev</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/projects" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Contact
            </NavLink>
          </li>
        </ul>

        {/* Action Controls */}
        <div className="nav-actions">
          <button
            onClick={cycleAccent}
            className="btn-icon accent-switcher"
            aria-label={`Change accent color. Current color: ${accentLabel}`}
            title={`Accent color: ${accentLabel}`}
          >
            <Palette size={19} />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="btn-icon"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="btn-icon nav-mobile-toggle"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <NavLink to="/" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile} end>
            <Layers size={18} /> Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile}>
            <User size={18} /> About Me
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile}>
            <Briefcase size={18} /> Projects & Works
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile}>
            <Mail size={18} /> Contact
          </NavLink>
        </div>
      )}
    </nav>
  );
};
