import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import CategoryManagementPage from './admin/CategoryManagementPage';
import ProductManagementPage from './admin/ProductManagementPage';
import AdminDashboard from './admin/AdminDashboard';

const AdminPage: React.FC = () => {
  const location = useLocation();
  const isRootPath = location.pathname === '/admin';

  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="categories" element={<CategoryManagementPage />} />
      <Route path="products" element={<ProductManagementPage />} />
    </Routes>
  );
};

export default AdminPage; 