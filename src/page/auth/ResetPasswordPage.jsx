import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom'; 
import { confirmResetPassword } from '../../services/auth';

const { Title, Text } = Typography;

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  
  // Lấy token từ URL
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      message.error("Đường dẫn lỗi: Không tìm thấy Token!");
      navigate("/login"); 
    }
  }, [token, navigate]);

  const onFinish = async (values) => {
    if (!token) return;
    try {
      setLoading(true);
      await confirmResetPassword(token, values.password);
      message.success("Đổi mật khẩu thành công! Hãy đăng nhập.");
      navigate("/login");
    } catch (err) {
      message.error(err.response?.data?.detail || "Lỗi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <Card style={{ width: 450, borderRadius: 12, padding: "20px" }}>
      <div style={{ textAlign: 'center', marginBottom: 25 }}>
        <Title level={2} style={{ color: '#1890ff' }}>Đặt Lại Mật Khẩu</Title>
        <Text>Nhập mật khẩu mới cho tài khoản của bạn</Text>
      </div>

      <Form layout="vertical" onFinish={onFinish} size="large">
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Nhập mật khẩu mới!' }, { min: 6 }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Xác nhận mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) return Promise.resolve();
                return Promise.reject(new Error('Mật khẩu không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block loading={loading}>
          Xác nhận thay đổi
        </Button>
      </Form>
    </Card>
  );
};

export default ResetPasswordPage;