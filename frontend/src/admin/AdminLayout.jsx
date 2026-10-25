import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  UserRound,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const navigation = [
  { label: 'Overview', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Projects', to: '/admin/projects', icon: BriefcaseBusiness },
  { label: 'Inquiries', to: '/admin/messages', icon: Mail },
  { label: 'Profile', to: '/admin/profile', icon: UserRound }
];

const pageTitles = {
  '/admin': 'Overview',
  '/admin/projects': 'Manage projects',
  '/admin/messages': 'Messages & inquiries',
  '/admin/profile': 'Profile management'
};

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    let active = true;
    const updateUnreadCount = async () => {
      try {
        const messages = await api.getAdminMessages();
        if (active) setUnreadCount(messages.filter(message => !message.read).length);
      } catch (error) {
        if (active) console.error('Could not load unread inquiry count:', error);
      }
    };

    updateUnreadCount();
    const intervalId = window.setInterval(updateUnreadCount, 30000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      setLogoutError(`Could not sign out: ${error.message}`);
    }
  };

  return (
    <div className="admin-app">
      {menuOpen && <button className="admin-sidebar-backdrop" onClick={() => setMenuOpen(false)} aria-label="Close admin menu" />}
      <aside className={`admin-sidebar${menuOpen ? ' is-open' : ''}`}>
        <NavLink to="/" className="admin-brand" aria-label="Memeriaw.dev home">
          <img src="/images/brand-photo.png" alt="" />
          <span>Memeriaw<span className="gradient-text">.dev</span></span>
        </NavLink>

        <div className="admin-nav-label">Workspace</div>
        <nav className="admin-nav" aria-label="Admin sections">
          {navigation.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === 'Inquiries' && (
                <>
                  <span className="admin-nav-hint">Inbox</span>
                  {unreadCount > 0 && (
                    <span
                      className="admin-nav-unread-count"
                      aria-label={`${unreadCount} unread inquiries`}
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-user-card">
            <img src="/images/brand-photo.png" alt="" />
            <div className="admin-user-copy">
              <strong>{user?.name || 'Administrator'}</strong>
              <span>Portfolio admin</span>
            </div>
          </div>
          <button className="admin-signout" onClick={handleLogout}>
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <button
            className="admin-menu-toggle"
            onClick={() => setMenuOpen(open => !open)}
            aria-label={menuOpen ? 'Close admin menu' : 'Open admin menu'}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="admin-breadcrumb">
            <span>Memeriaw.dev</span>
            <span aria-hidden="true">/</span>
            <strong>{pageTitles[location.pathname] || 'Admin'}</strong>
          </div>
          <a className="admin-view-site" href="/" target="_blank" rel="noreferrer">
            View portfolio <ArrowUpRight size={16} />
          </a>
        </header>

        <main className="admin-main">
          {logoutError && <div className="admin-alert error" role="alert">{logoutError}</div>}
          <Outlet context={{ setUnreadCount }} />
        </main>
      </div>
    </div>
  );
};
