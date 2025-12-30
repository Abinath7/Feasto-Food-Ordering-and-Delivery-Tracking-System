import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import MainLayout from './layouts/MainLayout';
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';
import DeliveryLayout from './layouts/DeliveryLayout';

// Pages
import About from './pages/About';
import Contact from './pages/Contact';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ChangePassword from './pages/auth/ChangePassword';
import ForgotPassword from './pages/auth/ForgotPassword';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import MyOrders from './pages/customer/MyOrders';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageMenu from './pages/admin/ManageMenu';
import ManageOrders from './pages/admin/ManageOrders';

// Delivery Pages
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route
              index
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />
            {/* About & Contact Pages */}
            <Route
              path="about"
              element={
                <PublicRoute>
                  <About />
                </PublicRoute>
              }
            />
            <Route
              path="contact"
              element={
                <PublicRoute>
                  <Contact />
                </PublicRoute>
              }
            />
          </Route>

          {/* Protected Route for Change Password */}
          <Route path="/" element={<MainLayout />}>
            <Route
              path="change-password"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Customer Routes */}
          <Route
            path="/customer"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="orders" element={<MyOrders />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="menu" element={<ManageMenu />} />
            <Route path="orders" element={<ManageOrders />} />
          </Route>

          {/* Delivery Routes */}
          <Route
            path="/delivery"
            element={
              <ProtectedRoute allowedRoles={['delivery']}>
                <DeliveryLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DeliveryDashboard />} />
          </Route>

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
