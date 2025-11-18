
import React, { useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GlobalStateProvider, GlobalStateContext } from './context/GlobalStateContext';

import AuthPage from './pages/AuthPage';
import Layout from './components/Layout';
import ImageGeneratorPage from './pages/user/ImageGeneratorPage';
import BuyCreditsPage from './pages/user/BuyCreditsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagementPage from './pages/admin/UserManagementPage';
import PaymentVerificationPage from './pages/admin/PaymentVerificationPage';
import WebsiteSettingsPage from './pages/admin/WebsiteSettingsPage';

// Wrapper to protect routes that require authentication
const ProtectedRoute: React.FC<{ children: React.ReactElement; adminOnly?: boolean }> = ({ children, adminOnly = false }) => {
  const context = useContext(GlobalStateContext);
  if (!context) return null;
  const { isAuthenticated, currentUser } = context;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  if (adminOnly && currentUser?.role !== 'admin') {
    return <Navigate to="/generate" replace />;
  }
  return children;
};

const AppContent: React.FC = () => {
    const context = useContext(GlobalStateContext);
    const isAuthenticated = context?.isAuthenticated || false;

    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={isAuthenticated ? <Navigate to="/generate" /> : <AuthPage />} />
                
                {/* User Routes */}
                <Route path="/generate" element={<ProtectedRoute><Layout><ImageGeneratorPage /></Layout></ProtectedRoute>} />
                <Route path="/buy-credits" element={<ProtectedRoute><Layout><BuyCreditsPage /></Layout></ProtectedRoute>} />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly={true}><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute adminOnly={true}><Layout><UserManagementPage /></Layout></ProtectedRoute>} />
                <Route path="/admin/payments" element={<ProtectedRoute adminOnly={true}><Layout><PaymentVerificationPage /></Layout></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute adminOnly={true}><Layout><WebsiteSettingsPage /></Layout></ProtectedRoute>} />
                
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </HashRouter>
    );
};

const App: React.FC = () => {
  return (
    <GlobalStateProvider>
        <Toaster
            position="top-right"
            toastOptions={{
                className: '',
                style: {
                    border: '1px solid #8B5CF6',
                    padding: '16px',
                    color: '#FFFFFF',
                    background: 'rgba(23, 23, 23, 0.8)',
                    backdropFilter: 'blur(10px)'
                },
            }}
        />
        <AppContent />
    </GlobalStateProvider>
  );
};

export default App;
