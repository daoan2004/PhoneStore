import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CategoryManagementPage from './admin/CategoryManagementPage';
import ProductManagementPage from './admin/ProductManagementPage';

const AdminPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="flex gap-4 mb-4">
        <Link to="/admin/categories" className="text-blue-600 hover:text-blue-800">
          Manage Categories
        </Link>
        <Link to="/admin/products" className="text-blue-600 hover:text-blue-800">
          Manage Products
        </Link>
      </div>
      <Routes>
        <Route path="categories" element={<CategoryManagementPage />} />
        <Route path="products" element={<ProductManagementPage />} />
      </Routes>
    </div>
  );
};

export default AdminPage; 