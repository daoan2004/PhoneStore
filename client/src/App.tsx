import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './app/store';
import { setLogoutHandler } from './services/api';
import { logout, initializeAuth } from './features/auth/authSlice';
import theme from './theme';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductPage from './pages/ProductPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import OrderPage from './pages/OrderPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRedirect from './components/AdminRedirect';
import AdminGuard from './components/AdminGuard';
import { useAppDispatch } from './app/hooks';

// Separate component to use hooks
const AppContent = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Set up logout handler for API service
    setLogoutHandler(() => {
      dispatch(logout());
    });

    // Initialize auth state
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <Router>
      <AdminGuard>
        <Routes>
          {/* Admin Routes với AdminLayout */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout>
                  <AdminPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* User Routes với UserLayout - Admin sẽ bị redirect */}
          <Route
            path="*"
            element={
              <AdminRedirect>
                <UserLayout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route
                      path="/cart"
                      element={
                        <ProtectedRoute>
                          <CartPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <CheckoutPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/order/:id"
                      element={
                        <ProtectedRoute>
                          <OrderPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/orders"
                      element={
                        <ProtectedRoute>
                          <OrderHistoryPage />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </UserLayout>
              </AdminRedirect>
            }
          />
        </Routes>
      </AdminGuard>
    </Router>
  );
};

// Root component that provides context
const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
