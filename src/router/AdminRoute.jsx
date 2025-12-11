import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const userStr = localStorage.getItem("user_info") || sessionStorage.getItem("user_info");
  const user = userStr ? JSON.parse(userStr) : null;
  const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");

  // 1. Chưa đăng nhập -> Đá về Login Admin
  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  // 2. Đã đăng nhập nhưng KHÔNG PHẢI ADMIN -> Đá về trang chủ (hoặc báo lỗi 403)
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 3. Chuẩn Admin -> Cho vào
  return <Outlet />;
};

export default AdminRoute;