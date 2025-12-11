import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Layouts
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout'; // 👈 Import Layout mới

// Import Guards (Bảo vệ Router)
import PrivateRoute from './PrivateRoute'; // 👈 File bảo vệ User
import AdminRoute from './AdminRoute';     // 👈 File bảo vệ Admin

// Import Pages (USER)
import LoginPage from '../page/auth/LoginPage';
import RegisterPage from '../page/auth/RegisterPage';
import ForgotPasswordPage from '../page/auth/ForgotPasswordPage';
import ResetPasswordPage from '../page/auth/ResetPasswordPage';
import HomePage from '../page/client/HomePage';
import ProductDetailPage from '../page/client/ProductDetailPage';
import CartPage from '../page/client/CartPage';
import PaymentSuccessPage from '../page/client/PaymentSuccessPage';
import PaymentCancelPage from '../page/client/PaymentCancelPage';
import ProfilePage from '../page/client/ProfilePage';
import OrderHistoryPage from '../page/client/OrderHistoryPage';
import ProductsPage from '../page/client/ProductsPage';

// Import Pages (ADMIN)
import AdminLoginPage from '../page/admin/AdminLoginPage'; // 👈 Trang Login Admin riêng
import DashboardPage from '../pages/admin/DashboardPage';       // Trang thống kê
import OrderManagerPage from '../pages/admin/OrderManagerPage'; // Trang quản lý đơn
import ProductManagerPage from '../pages/admin/ProductManagerPage'; // Trang quản lý SP

const AppRouter = () => {
  // Check nhanh token để redirect khỏi trang login nếu đã đăng nhập
  const isAuthenticated = !!(localStorage.getItem("access_token") || sessionStorage.getItem("access_token"));

  return (
    <Routes>
      {/* ============================================================ */}
      {/* 🟢 NHÓM 1: USER PUBLIC (Login/Register) */}
      {/* ============================================================ */}
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

      {/* ============================================================ */}
      {/* 🔴 NHÓM 2: ADMIN LOGIN (Login Riêng Biệt) */}
      {/* ============================================================ */}
      {/* Nếu đã login rồi thì vào thẳng dashboard admin, chưa thì hiện form login admin */}
      <Route 
         path="/admin/login" 
         element={!isAuthenticated ? <AdminLoginPage /> : <Navigate to="/admin" />} 
      />

      {/* ============================================================ */}
      {/* 🔵 NHÓM 3: USER PROTECTED (Cần đăng nhập User/Admin đều được) */}
      {/* ============================================================ */}
      <Route element={<PrivateRoute />}>
         <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/payment/cancel" element={<PaymentCancelPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/products" element={<ProductsPage />} />
         </Route>
      </Route>

      {/* ============================================================ */}
      {/* ⚫ NHÓM 4: ADMIN PROTECTED (Chỉ Admin mới vào được) */}
      {/* ============================================================ */}
      <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="orders" element={<OrderManagerPage />} />
              <Route path="products" element={<ProductManagerPage />} />
              {/* <Route path="users" element={<UserManagerPage />} /> */}
          </Route>
      </Route>

      {/* Catch all - Điều hướng trang 404 về trang chủ */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;