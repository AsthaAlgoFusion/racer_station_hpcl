import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';
import Profile from '@/components/Profile';
import Analytics from '@/components/Analytics';
import Documents from '@/components/Documents';
import Users from '@/components/Users';
import Notifications from '@/components/Notifications';
import Security from '@/components/Security';
import Products from '../src/components/pages/Products';
import SpareParts from '../src/components/pages/SpareParts';
import Settings from '@/components/Settings';
import type { AuthResponse } from '@/services/mockAuth';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const [authResponse, setAuthResponse] = useState<AuthResponse | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  const handleAuthSuccess = (response: AuthResponse) => {
    setAuthResponse(response);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setAuthResponse(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <>
        <LoginForm onAuthSuccess={handleAuthSuccess} />
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 4000,
          }}
        />
      </>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route 
            path="/" 
            element={
              <AnimatedPage>
                <Dashboard 
                  authResponse={authResponse!} 
                  onLogout={handleLogout} 
                />
              </AnimatedPage>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <AnimatedPage>
                <Dashboard 
                  authResponse={authResponse!} 
                  onLogout={handleLogout} 
                />
              </AnimatedPage>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <AnimatedPage>
                <Profile 
                  authResponse={authResponse!} 
                  onLogout={handleLogout} 
                />
              </AnimatedPage>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <AnimatedPage>
                <Analytics 
                  authResponse={authResponse!} 
                  onLogout={handleLogout} 
                />
              </AnimatedPage>
            } 
          />
          <Route 
            path="/documents" 
            element={
              <AnimatedPage>
                <Documents 
                  authResponse={authResponse!} 
                  onLogout={handleLogout} 
                />
              </AnimatedPage>
            } 
          />
          <Route 
            path="/users" 
            element={
              <AnimatedPage>
                <Users 
                  authResponse={authResponse!} 
                  onLogout={handleLogout} 
                />
              </AnimatedPage>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <AnimatedPage>
                <Notifications 
                  authResponse={authResponse!} 
                  onLogout={handleLogout} 
                />
              </AnimatedPage>
            } 
          />
          <Route 
            path="/security" 
            element={
              <AnimatedPage>
                <Security 
                  authResponse={authResponse!} 
                  onLogout={handleLogout} 
                />
              </AnimatedPage>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <AnimatedPage>
                <Settings 
                  authResponse={authResponse!} 
                  onLogout={handleLogout} 
                />
              </AnimatedPage>
            } 
          />
          <Route path="products" element={<Products />} />
          <Route path="spare-parts" element={<SpareParts />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AnimatePresence>
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 4000,
        }}
      />
    </>
  );
}

export default App;
