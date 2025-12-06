import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Image, Typography, Button, Rate, Tag, InputNumber, Divider, Space, message, Spin, Card, Breadcrumb } from 'antd';
import { ShoppingCartOutlined, CheckCircleOutlined, HomeOutlined } from '@ant-design/icons';

import { getProductById } from '../../services/product';
import { getReviewsByProduct } from '../../services/reviews';
import { formatPrice } from '../../utils/format';

// Import Component Reviews vừa tách
import ProductReviews from '../../components/product/ProductReviews';

const { Title, Paragraph, Text } = Typography;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const isAuthenticated = !!(localStorage.getItem("access_token"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productData, reviewsData] = await Promise.all([
            getProductById(id),
            getReviewsByProduct(id)
        ]);

        setProduct(productData);
        setReviews(reviewsData);

        if (reviewsData.length > 0) {
            const total = reviewsData.reduce((acc, curr) => acc + curr.Rating, 0);
            setAvgRating(total / reviewsData.length);
        } else {
            setAvgRating(5);
        }
      } catch (error) {
        console.error("Lỗi:", error);
        message.error("Lỗi tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (quantity > product.Stock) {
        message.warning("Số lượng yêu cầu vượt quá tồn kho!");
        return;
    }
    message.success(`Đã thêm ${quantity} sản phẩm vào giỏ!`);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}><Spin size="large" /></div>;
  if (!product) return null;

  return (
    <div style={{ paddingBottom: '40px' }}>
      <Breadcrumb style={{ margin: '16px 0' }} items={[{ href: '/', title: <HomeOutlined /> }, { title: product.ProductName }]} />

      <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Row gutter={[48, 32]}>
          <Col xs={24} md={10}>
            <div style={{ border: '1px solid #f0f0f0', borderRadius: '8px', padding: '20px', display: 'flex', justifyContent: 'center' }}>
              <Image src={product.ImageURL || "https://via.placeholder.com/500"} style={{ maxHeight: '400px', objectFit: 'contain' }} />
            </div>
          </Col>

          <Col xs={24} md={14}>
            <Title level={2}>{product.ProductName}</Title>
            
            <Space style={{ marginBottom: 20 }}>
                <Rate disabled allowHalf value={avgRating} style={{ fontSize: 14, color: '#faad14' }} />
                <Text type="secondary">({reviews.length} đánh giá)</Text>
                <Divider type="vertical" />
                {product.Stock > 0 ? <Tag color="success" icon={<CheckCircleOutlined />}>Còn hàng</Tag> : <Tag color="error">Hết hàng</Tag>}
            </Space>

            <div style={{ background: '#fafafa', padding: '15px', borderRadius: '8px', marginBottom: '24px' }}>
                <Text type="danger" style={{ fontSize: '32px', fontWeight: 'bold' }}>{formatPrice(product.Price)}</Text>
            </div>

            <div style={{ marginBottom: '24px' }}>
                <Title level={5}>Đặc điểm nổi bật:</Title>
                <Paragraph>{product.MarketingContent || product.Description}</Paragraph>
            </div>

            <Divider />

            <Space size="large">
                <InputNumber min={1} max={product.Stock} defaultValue={1} onChange={setQuantity} />
                <Button type="primary" size="large" icon={<ShoppingCartOutlined />} onClick={handleAddToCart}>Thêm vào giỏ</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* --- PHẦN REVIEWS ĐÃ TÁCH COMPONENT --- */}
      <ProductReviews 
        productId={id} 
        reviews={reviews} 
        setReviews={setReviews} 
        setAvgRating={setAvgRating} 
        isAuthenticated={isAuthenticated} 
      />
    </div>
  );
};

export default ProductDetailPage;