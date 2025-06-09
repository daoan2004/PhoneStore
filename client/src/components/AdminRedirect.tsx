import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

interface AdminRedirectProps {
  children: React.ReactElement;
}

const AdminRedirect: React.FC<AdminRedirectProps> = ({ children }) => {
  const { user } = useAppSelector((state) => state.auth);

  // If user is admin, redirect to admin dashboard
  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default AdminRedirect; 