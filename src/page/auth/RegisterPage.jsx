import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SmileOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/auth'; // Import hàm register từ service

const { Title, Text } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      
      // Gọi API đăng ký: Backend cần FullName, Email, Password
      await register(values.fullName, values.email, values.password);

      message.success("Đăng ký thành công! Vui lòng đăng nhập.");
      
      // Đăng ký xong thì chuyển ngay về trang Login để người dùng đăng nhập
      navigate("/login");
      
    } catch (err) {
      console.error("Register Error:", err);
      // Hiển thị lỗi từ Backend (ví dụ: Email đã tồn tại)
      const errorMsg = err.response?.data?.detail || "Đăng ký thất bại. Vui lòng thử lại!";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      style={{
        width: 450, // Rộng hơn form login một chút
        maxWidth: '100%',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        padding: '20px 10px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <Title level={2} style={{ color: '#1890ff', margin: 0 }}>
          Tạo tài khoản
        </Title>
        <Text type="secondary">Gia nhập cộng đồng WehappiTech ngay hôm nay</Text>
      </div>

      <Form
        name="register_form"
        layout="vertical"
        onFinish={onFinish}
        size="large"
        scrollToFirstError
      >
        {/* 1. Họ và tên */}
        <Form.Item
          name="fullName"
          rules={[
            { required: true, message: 'Vui lòng nhập họ và tên!' },
            { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' }
          ]}
        >
          <Input 
            prefix={<SmileOutlined className="site-form-item-icon" />} 
            placeholder="Họ và tên đầy đủ" 
          />
        </Form.Item>

        {/* 2. Email */}
        <Form.Item
          name="email"
          rules={[
            { type: 'email', message: 'Email không hợp lệ!' },
            { required: true, message: 'Vui lòng nhập Email!' },
          ]}
        >
          <Input 
            prefix={<MailOutlined className="site-form-item-icon" />} 
            placeholder="Email" 
          />
        </Form.Item>

        {/* 3. Mật khẩu */}
        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu!' },
            { min: 6, message: 'Mật khẩu phải từ 6 ký tự trở lên!' },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Mật khẩu"
          />
        </Form.Item>

        {/* 4. Nhập lại mật khẩu (Confirm Password) */}
        <Form.Item
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Hai mật khẩu không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Xác nhận mật khẩu"
          />
        </Form.Item>

        {/* Nút Đăng ký */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Đăng ký tài khoản
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          Đã có tài khoản? <Link to="/login" style={{fontWeight: 'bold'}}>Đăng nhập ngay</Link>
        </div>
      </Form>
    </Card>
  );
};

export default RegisterPage;