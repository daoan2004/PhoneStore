import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Only redirect after auth is initialized and if user is admin
    if (isInitialized && user?.role === 'admin') {
      // If admin is trying to access user routes, redirect to admin
      if (!location.pathname.startsWith('/admin')) {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [user, isInitialized, location.pathname, navigate]);

  return <>{children}</>;
};

export default AdminGuard; 