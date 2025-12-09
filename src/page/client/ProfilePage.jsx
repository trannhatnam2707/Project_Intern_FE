// src/page/client/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, Avatar, Typography, message, Row, Col, Spin } from 'antd';
import { UserOutlined, SaveOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { getMe, updateProfile } from '../../services/auth';

const { Title, Text } = Typography;

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);

  // Load thông tin user
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMe();
        setUser(data);
        form.setFieldsValue(data); // Đổ dữ liệu vào form
      } catch (error) {
        message.error("Không tải được thông tin cá nhân");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [form]);

  // Xử lý cập nhật
  const onFinish = async (values) => {
    try {
      setUpdating(true);
      await updateProfile(values); // Gọi API Update
      message.success("Cập nhật hồ sơ thành công!");
      
      // Cập nhật lại localStorage để Header hiển thị đúng tên mới
      const oldUser = JSON.parse(localStorage.getItem("user_info") || "{}");
      localStorage.setItem("user_info", JSON.stringify({ ...oldUser, ...values }));
      
      // Refresh trang để thấy thay đổi (hoặc dùng state để update UI)
      window.location.reload(); 
    } catch (error) {
      message.error("Cập nhật thất bại: " + (error.response?.data?.detail || "Lỗi hệ thống"));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;

  return (
    <div style={{ padding: '40px 0', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>Hồ sơ cá nhân</Title>
      
      <Row gutter={[24, 24]}>
        {/* Cột trái: Avatar & Thông tin tĩnh */}
        <Col xs={24} md={8} style={{ textAlign: 'center' }}>
          <Card style={{ borderRadius: 12 }}>
            <Avatar size={100} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff', marginBottom: 20 }} />
            <Title level={4}>{user?.FullName}</Title>
            <Text type="secondary">{user?.Email}</Text>
            <div style={{ marginTop: 20, textAlign: 'left' }}>
               <p><UserOutlined /> Thành viên từ: 2025</p>
               <p><EnvironmentOutlined /> Việt Nam</p>
            </div>
          </Card>
        </Col>

        {/* Cột phải: Form sửa thông tin */}
        <Col xs={24} md={16}>
          <Card title="Chỉnh sửa thông tin" style={{ borderRadius: 12 }}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item label="Họ và tên" name="FullName" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
                <Input prefix={<UserOutlined />} size="large" />
              </Form.Item>

              <Form.Item label="Email (Không thể thay đổi)" name="Email">
                <Input prefix={<MailOutlined />} size="large" disabled />
              </Form.Item>

              <Form.Item label="Số điện thoại" name="PhoneNumber">
                <Input prefix={<PhoneOutlined />} size="large" placeholder="Cập nhật số điện thoại" />
              </Form.Item>

              <Form.Item label="Địa chỉ" name="Address">
                <Input prefix={<EnvironmentOutlined />} size="large" placeholder="Cập nhật địa chỉ giao hàng" />
              </Form.Item>

              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={updating} size="large" block>
                Lưu thay đổi
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;