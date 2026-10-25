import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { About } from '../pages/About';
import { Projects } from '../pages/Projects';
import { ProjectDetails } from '../pages/ProjectDetails';
import { Contact } from '../pages/Contact';
import { NotFound } from '../pages/NotFound';
import { AdminLogin } from '../admin/AdminLogin';
import { Dashboard } from '../admin/Dashboard';
import { ManageProjects } from '../admin/ManageProjects';
import { ManageMessages } from '../admin/ManageMessages';
import { ProfileManagement } from '../admin/ProfileManagement';
import { AdminLayout } from '../admin/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:slug" element={<ProjectDetails />} />
      <Route path="/contact" element={<Contact />} />

      {/* Admin Authentication & Protected Portal */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<ManageProjects />} />
        <Route path="messages" element={<ManageMessages />} />
        <Route path="profile" element={<ProfileManagement />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
