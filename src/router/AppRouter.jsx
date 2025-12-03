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
        
        {/* Sau này thêm các route khác như: /products, /cart, /profile... */}
      </Route>

      {/* Catch all - Điều hướng trang 404 về trang chủ */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;