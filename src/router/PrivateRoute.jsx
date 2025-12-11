import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");

  // Nếu chưa đăng nhập -> Đá về Login User
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;