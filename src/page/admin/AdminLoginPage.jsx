import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { login } from '../../services/auth';

const { Title, Text } = Typography;

const AdminLoginPage = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      // Admin luôn dùng chế độ "Ghi nhớ" (true) hoặc tùy bạn chỉnh
      const res = await login(values.email, values.password, true); 

      if (res.user && res.user.role === 'admin') {
        message.success("Chào mừng quản trị viên!");
        window.location.href = "/admin"; // Vào Dashboard
      } else {
        message.error("Bạn không có quyền truy cập trang này!");
        // Xóa token vừa lưu để tránh bị coi là đã login
        localStorage.clear();
        sessionStorage.clear();
      }
    } catch (err) {
      console.error(err);
      message.error("Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card style={{ width: 400, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div className="text-center mb-8">
            <SafetyCertificateOutlined style={{ fontSize: '40px', color: '#1890ff' }} />
            <Title level={3}>Admin Portal</Title>
            <Text type="secondary">Đăng nhập quyền quản trị</Text>
        </div>
        <Form name="admin_login" onFinish={onFinish} size="large">
            <Form.Item name="email" rules={[{ required: true, message: 'Nhập email!' }]}>
                <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Nhập mật khẩu!' }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>Đăng nhập</Button>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLoginPage;