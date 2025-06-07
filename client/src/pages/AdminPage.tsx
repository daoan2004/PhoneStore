import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import CategoryManagementPage from './admin/CategoryManagementPage';
import ProductManagementPage from './admin/ProductManagementPage';
import AdminDashboard from './admin/AdminDashboard';
import { Box, Container } from '@mui/material';

const AdminPage: React.FC = () => {
  const location = useLocation();
  const isRootPath = location.pathname === '/admin';

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ minHeight: '80vh' }}>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="categories" element={<CategoryManagementPage />} />
          <Route path="products" element={<ProductManagementPage />} />
        </Routes>
      </Box>
    </Container>
  );
};

export default AdminPage; 