import React from 'react';
import { Outlet } from 'react-router-dom';
import { Typography } from 'antd';

const { Title, Text } = Typography;

const AuthLayout = () => (
  <div
    style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      // 1. Ảnh nền bao trùm toàn bộ màn hình
      backgroundImage: "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2670&auto=format&fit=crop')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
  >
    {/* 2. Lớp phủ màu tối (Overlay) để làm dịu ảnh nền, giúp chữ dễ đọc hơn */}
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to right, rgba(0, 21, 41, 0.9), rgba(0, 21, 41, 0.6))', // Xanh đen mờ ảo
        zIndex: 1
      }} />

    {/* 3. Container chứa nội dung (Nổi lên trên lớp phủ) */}
    <div
      style={{
        zIndex: 2,
        display: 'flex',
        width: '100%',
        maxWidth: '1200px', // Giới hạn chiều rộng để nội dung không bị bè ra quá xa
        padding: '0 40px',
        alignItems: 'center',
        justifyContent: 'space-between', // Đẩy chữ sang trái, Form sang phải
        flexWrap: 'wrap', // Tự xuống dòng trên màn hình nhỏ
        gap: '40px'
      }}
    >

      {/* --- PHẦN TEXT THƯƠNG HIỆU (BÊN TRÁI) --- */}
      <div style={{ flex: 1, minWidth: '300px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          {/* Logo giả lập bằng CSS */}
          <div style={{
            width: '50px', height: '50px',
            background: '#1890ff',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', fontWeight: 'bold', color: '#fff',
            boxShadow: '0 0 20px rgba(24, 144, 255, 0.5)'
          }}>W</div>
          <Title level={1} style={{ color: '#fff', margin: 0, fontSize: '42px', letterSpacing: '1px' }}>
            WehappiTech
          </Title>
        </div>

        <Title level={3} style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 300, margin: '0 0 20px 0' }}>
          Giải pháp công nghệ <span style={{ color: '#1890ff', fontWeight: 'bold' }}>Toàn diện</span>
        </Title>

        <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '16px', lineHeight: '1.8', maxWidth: '500px', display: 'block' }}>
        WeHappi xin chào và cảm ơn bạn đã ghé thăm!
        Hành trình mua sắm của bạn sẽ được tối ưu bởi công nghệ hiện đại và AI thông minh.
        Đăng nhập để quản lý đơn hàng, theo dõi giao hàng, cập nhật hồ sơ và lưu sản phẩm yêu thích.
        WeHappi cam kết mang đến cho bạn trải nghiệm mượt mà, tiện lợi và đáng tin cậy.
        </Text>

        {/* Dấu gạch trang trí */}
        <div style={{ marginTop: '30px', display: 'flex', gap: '8px' }}>
          <div style={{ width: '40px', height: '4px', background: '#1890ff', borderRadius: '2px' }}></div>
          <div style={{ width: '10px', height: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px' }}></div>
          <div style={{ width: '10px', height: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px' }}></div>
        </div>
      </div>

      {/* --- PHẦN FORM (BÊN PHẢI) --- */}
      <div style={{ flexShrink: 0, animation: 'fadeInUp 0.8s ease-out' }}>
        <Outlet />
      </div>

    </div>

    {/* CSS Animation nhỏ cho Form bay lên */}
    <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    {/* Footer bản quyền */}
    <div style={{
      position: 'absolute', bottom: '20px',
      color: 'rgba(255,255,255,0.4)', zIndex: 2, fontSize: '13px'
    }}>
      © 2025 WehappiTech Inc. All rights reserved.
    </div>
  </div>
);

export default AuthLayout;