import React from 'react';
import AdminLayout from '../layouts/AdminLayout';
import AdminPage from '../pages/AdminPage';

const AdminWrapper: React.FC = () => {
  return (
    <AdminLayout>
      <AdminPage />
    </AdminLayout>
  );
};

export default AdminWrapper; 