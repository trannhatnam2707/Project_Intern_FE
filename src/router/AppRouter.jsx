import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Layouts
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';

// Import Pages
import LoginPage from '../page/auth/LoginPage';
import RegisterPage from '../page/auth/RegisterPage';
import HomePage from '../page/client/HomePage';
import ForgotPasswordPage from '../page/auth/ForgotPasswordPage';
import ResetPasswordPage from '../page/auth/ResetPasswordPage';
import ProductDetailPage from '../page/client/ProductDetailPage';
import CartPage from '../page/client/CartPage';
import PaymentSuccessPage from '../page/client/PaymentSuccessPage';
import PaymentCancelPage from '../page/client/PaymentCancelPage';
import ProfilePage from '../page/client/ProfilePage';
import OrderHistoryPage from '../page/client/OrderHistoryPage';

const AppRouter = () => {
  // Kiểm tra token để xác định trạng thái đăng nhập
  const isAuthenticated = !!(localStorage.getItem("access_token") || sessionStorage.getItem("access_token"));

  return (
    <Routes>
      {/* NHÓM 1: Public Layout (Authentication) */}
      <Route element={<AuthLayout />}>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} 
        />
        <Route 
          path="/register" 
          element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} 
        />
        <Route
          path='/forgot-password'
          element={!isAuthenticated ? <ForgotPasswordPage /> : <Navigate to="/" />}
        />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* NHÓM 2: Protected Layout (Yêu cầu đăng nhập) */}
      <Route element={<MainLayout />}>
        <Route 
          path="/" 
          element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/product/:id" 
          element={isAuthenticated ? <ProductDetailPage /> : <Navigate to="/login" />} 
        />
        <Route path="/cart" element={<CartPage />} />

        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/cancel" element={<PaymentCancelPage />} />

        <Route 
        path="/profile" 
        element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} 
        />
        <Route 
            path="/orders" 
            element={isAuthenticated ? <OrderHistoryPage /> : <Navigate to="/login" />} 
        />
        </Route>

      {/* Catch all - Điều hướng trang 404 về trang chủ */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;