import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAdminRoute && <Navbar />}
      <main style={{ flex: '1 0 auto' }}>
        <AppRoutes />
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
