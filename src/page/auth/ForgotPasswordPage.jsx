import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Typography } from 'antd';
import { MailOutlined, ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../services/auth';

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Trạng thái gửi thành công

  const onFinish = async (values) => {
    try {
      setLoading(true);
      // Gọi API thật
      await forgotPassword(values.email);
      
      // Nếu không báo lỗi gì thì là thành công
      setIsSuccess(true);
      message.success("Đã gửi hướng dẫn về email!");
    } catch (err) {
      console.error(err);
      // Hiển thị lỗi từ Backend (ví dụ: Email không tồn tại)
      message.error(err.response?.data?.detail || "Có lỗi xảy ra, vui lòng thử lại.");
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
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        padding: '20px 10px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <Title level={2} style={{ color: '#1890ff', margin: 0 }}>
          {isSuccess ? "Kiểm tra Email" : "Quên Mật Khẩu?"}
        </Title>
        <Text type="secondary">
          {isSuccess 
            ? "Chúng tôi đã gửi link khôi phục đến hộp thư của bạn." 
            : "Nhập email để nhận hướng dẫn lấy lại mật khẩu."}
        </Text>
      </div>

      {!isSuccess ? (
        // --- FORM NHẬP EMAIL ---
        <Form
          name="forgot_password"
          layout="vertical"
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập Email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input 
              prefix={<MailOutlined className="site-form-item-icon" />} 
              placeholder="Nhập email của bạn" 
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Gửi yêu cầu
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <Link to="/login">
              <ArrowLeftOutlined /> Quay lại Đăng nhập
            </Link>
          </div>
        </Form>
      ) : (
        // --- MÀN HÌNH THÔNG BÁO THÀNH CÔNG ---
        <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
          <div style={{ marginBottom: '20px' }}>
            <CheckCircleOutlined style={{ fontSize: '60px', color: '#52c41a' }} />
          </div>
          <p>Link đặt lại mật khẩu sẽ hết hạn trong 15 phút.</p>
          <p style={{ fontSize: '13px', color: '#888' }}>
            Nếu không thấy, hãy kiểm tra mục Spam/Rác.
          </p>
          
          <Link to="/login">
            <Button type="default" block style={{ marginTop: '20px' }}>
              Quay về Đăng nhập
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
};

export default ForgotPasswordPage;