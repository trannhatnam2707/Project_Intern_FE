import React from 'react';
import { Card, List, Avatar, Space, Typography, Rate, Form, Input, Button, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createReview } from '../../services/reviews';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ProductReviews = ({ productId, reviews, setReviews, setAvgRating, isAuthenticated }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = React.useState(false);

  const onFinishReview = async (values) => {
    if (!isAuthenticated) {
        message.warning("Vui lòng đăng nhập để đánh giá!");
        navigate("/login");
        return;
    }

    try {
        setSubmitting(true);
        const newReview = await createReview(productId, values.rating, values.comment);
        message.success("Cảm ơn bạn đã đánh giá!");
        
        // Update UI
        const newReviewsList = [newReview, ...reviews];
        setReviews(newReviewsList);
        
        // Recalculate Rating
        const total = newReviewsList.reduce((acc, curr) => acc + curr.Rating, 0);
        setAvgRating(total / newReviewsList.length);

        form.resetFields();
    } catch (error) {
        message.error("Gửi đánh giá thất bại");
    } finally {
        setSubmitting(false);
    }
  };

  return (
    <Card style={{ marginTop: '24px', borderRadius: '12px' }} title={<Title level={4}>Đánh giá sản phẩm</Title>}>
      {/* Form viết đánh giá */}
      <div style={{ marginBottom: '40px', background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
          <Text strong style={{ fontSize: '16px' }}>Viết đánh giá của bạn</Text>
          {isAuthenticated ? (
              <Form form={form} onFinish={onFinishReview} layout="vertical" style={{ marginTop: '15px' }}>
                  <Form.Item name="rating" label="Bạn chấm mấy sao?" rules={[{ required: true, message: 'Vui lòng chọn số sao!' }]}>
                      <Rate />
                  </Form.Item>
                  <Form.Item name="comment" label="Nhận xét của bạn" rules={[{ required: true, message: 'Hãy viết vài lời nhận xét nhé!' }]}>
                      <TextArea rows={3} placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..." />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" loading={submitting}>Gửi đánh giá</Button>
              </Form>
          ) : (
              <div style={{ marginTop: '10px' }}>
                  <Button type="dashed" onClick={() => navigate('/login')}>Đăng nhập để viết đánh giá</Button>
              </div>
          )}
      </div>

      {/* Danh sách Review */}
      <List
          itemLayout="horizontal"
          dataSource={reviews}
          renderItem={(item) => (
          <List.Item>
              <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />}
              title={
                  <Space>
                      <Text strong>{item.FullName}</Text>
                      <Rate disabled value={item.Rating} style={{ fontSize: 12 }} />
                      <Text type="secondary" style={{ fontSize: '12px' }}>{new Date(item.CreatedAt).toLocaleDateString('vi-VN')}</Text>
                  </Space>
              }
              description={item.Comment}
              />
          </List.Item>
          )}
      />
      {reviews.length === 0 && <Text type="secondary" style={{ display: 'block', textAlign: 'center' }}>Chưa có đánh giá nào. Hãy là người đầu tiên!</Text>}
    </Card>
  );
};

export default ProductReviews;