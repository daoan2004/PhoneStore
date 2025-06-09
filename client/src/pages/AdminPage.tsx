import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CategoryManagementPage from './admin/CategoryManagementPage';
import ProductManagementPage from './admin/ProductManagementPage';
import UserManagementPage from './admin/UserManagementPage';
import OrderManagementPage from './admin/OrderManagementPage';
import ReviewManagementPage from './admin/ReviewManagementPage';
import DashboardPage from './admin/DashboardPage';

const AdminPage: React.FC = () => {
  return (
    <Routes>
      <Route index element={<DashboardPage />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="products" element={<ProductManagementPage />} />
      <Route path="categories" element={<CategoryManagementPage />} />
      <Route path="users" element={<UserManagementPage />} />
      <Route path="orders" element={<OrderManagementPage />} />
      <Route path="reviews" element={<ReviewManagementPage />} />
    </Routes>
  );
};

export default AdminPage; 