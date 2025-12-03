import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Typography, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/auth'; // Import từ service layer

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Xử lý khi người dùng nhấn nút Đăng nhập
const onFinish = async (values) => {
    try {
      setLoading(true);
      
      // values.remember sẽ là true/false lấy từ Form.Item name="remember"
      await login(values.email, values.password, values.remember);

      message.success("Đăng nhập thành công!");
      window.location.href = "/";
      
    } catch (err) {
      // ...
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      style={{
        width: 400,
        maxWidth: '100%',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)', // Đổ bóng cho đẹp
        padding: '20px 10px',
      }}
    >
      {/* Header của Form */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <Title level={2} style={{ color: '#0084ff', margin: 0, fontWeight: 700 }}>
          WehappiTech
        </Title>
        <Text style={{ color: 'black' }}>Đăng nhập hệ thống</Text>
      </div>

      {/* Form Nhập liệu */}
      <Form
        name="login_form"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        size="large"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập Email!' },
            { type: 'email', message: 'Email không đúng định dạng!' },
          ]}
        >
          <Input 
            prefix={<UserOutlined className="site-form-item-icon" />} 
            placeholder="Email" 
            autoComplete='username'
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Mật khẩu"
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>

          <a style={{ float: 'right' }} href="/forgot-password">
            Quên mật khẩu?
          </a>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Đăng nhập
          </Button>
        </Form.Item>
        
        <div style={{ textAlign: 'center' }}>
          Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </div>
      </Form>
    </Card>
  );
};

export default LoginPage;