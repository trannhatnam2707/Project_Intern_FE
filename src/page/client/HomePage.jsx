import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Spin, Typography, Button, message, Image, Tag } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../../services/product';

const { Title, Text } = Typography;

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
        message.error("Không thể tải danh sách sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div>
      {/* Banner */}
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <Title level={2} style={{ color: '#1890ff', marginBottom: '5px' }}>Sản Phẩm Nổi Bật</Title>
        <Text type="secondary">Công nghệ mới nhất dành cho bạn</Text>
      </div>

      {/* Loading */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" tip="Đang tải sản phẩm..." />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {products.map((product) => (
            <Col key={product.ProductID} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                style={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f0f0f0' }}
                bodyStyle={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column' }}
                cover={
                  <div style={{ height: 200, padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                    <Image
                      alt={product.ProductName}
                      src={product.ImageURL || "https://via.placeholder.com/300x300?text=No+Image"} 
                      preview={false}
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', transition: 'transform 0.3s' }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                }
                actions={[
                  <Button type="text" icon={<ShoppingCartOutlined key="cart" />}>Thêm giỏ</Button>,
                  <Button 
                    type="text" 
                    icon={<EyeOutlined key="view" />}
                    onClick={() => navigate(`/product/${product.ProductID}`)}
                  >
                    Chi tiết
                  </Button>
                ]}
              >
                {/* 1. Tên sản phẩm */}
                <div style={{ marginBottom: '8px' }}>
                   <h3 style={{ 
                     fontSize: '16px', 
                     margin: 0, 
                     lineHeight: '1.4',
                     height: '44px', 
                     overflow: 'hidden',
                     display: '-webkit-box',
                     WebkitLineClamp: 2,
                     WebkitBoxOrient: 'vertical',
                   }}>
                     {product.ProductName}
                   </h3>
                </div>

                {/* 2. THÊM MỚI: Description / Marketing Content */}
                <div style={{ marginBottom: '12px', flex: 1 }}>
                  <Text type="secondary" style={{ 
                    fontSize: '13px',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2, // Giới hạn 2 dòng
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '36px' // Giữ chỗ nếu nội dung ngắn
                  }}>
                    {/* Ưu tiên hiện MarketingContent, nếu không có thì hiện Description */}
                    {product.MarketingContent || "Sản phẩm công nghệ chính hãng chất lượng cao."}
                  </Text>
                </div>

                {/* 3. Giá và Tồn kho */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <Text type="danger" strong style={{ fontSize: '18px' }}>
                    {formatPrice(product.Price)}
                  </Text>
                  {product.Stock > 0 ? (
                    <Tag color="green" style={{marginRight: 0}}>Sẵn hàng</Tag>
                  ) : (
                    <Tag color="red" style={{marginRight: 0}}>Hết hàng</Tag>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {!loading && products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Text type="secondary">Chưa có sản phẩm nào trong hệ thống.</Text>
        </div>
      )}
    </div>
  );
};

export default HomePage;