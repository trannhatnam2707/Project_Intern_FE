import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import AppHeader from '../components/layout/Header'; // Import Header
import AppFooter from '../components/layout/Footer'; // Import Footer

const { Content } = Layout;

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 1. Header */}
      <AppHeader />

      {/* 2. Nội dung chính (Thay đổi theo router) */}
      <Content style={{ padding: '24px 50px', background: '#f0f2f5' }}>
        {/* Container giúp nội dung không bị bè ra quá rộng trên màn hình lớn */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
          <Outlet />
        </div>
      </Content>

      {/* 3. Footer */}
      <AppFooter />
    </Layout>
  );
};

export default MainLayout;