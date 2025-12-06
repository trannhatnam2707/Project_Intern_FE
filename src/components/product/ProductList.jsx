import React from 'react';
import { Row, Col, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';

const { Title } = Typography;

const ProductList = ({ title, icon, products, viewAllLink }) => {
  const navigate = useNavigate();

  if (!products || products.length === 0) return null;

  return (
    <div style={{ marginBottom: '40px' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
        <Title level={3} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: '#001529' }}>
          {icon} {title}
        </Title>
        {viewAllLink && (
          <Button type="link" onClick={() => navigate(viewAllLink)} style={{ fontSize: '14px' }}>
            Xem tất cả &gt;
          </Button>
        )}
      </div>

      {/* Product Grid */}
      <Row gutter={[20, 20]}>
        {products.map((product) => (
          <Col key={product.ProductID} xs={24} sm={12} md={8} lg={6}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductList;