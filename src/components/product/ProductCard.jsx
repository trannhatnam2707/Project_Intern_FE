import React from 'react';
import { Card, Image, Button, Typography, Tag, message } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/format';
import { addToCart } from '../../utils/cart';

const { Text } = Typography;

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Chặn sự kiện click lan ra ngoài thẻ card
    addToCart(product, 1);
    message.success(`Đã thêm ${product.ProductName} vào giỏ!`);
  };

  return (
    <Card
      hoverable
      style={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        borderRadius: '12px', 
        overflow: 'hidden', 
        border: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}
      bodyStyle={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column' }}
      cover={
        <div style={{ 
          height: 180, 
          padding: '15px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: '#fff',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Image
            alt={product.ProductName}
            src={product.ImageURL || "https://via.placeholder.com/300x300?text=No+Image"} 
            preview={false}
            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', transition: 'transform 0.3s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onClick={() => navigate(`/product/${product.ProductID}`)}
            cursor="pointer"
          />
        </div>
      }
      actions={[
        <Button key="cart" type="text" icon={<ShoppingCartOutlined />} onClick={handleAddToCart}>
          Thêm giỏ
        </Button>,
        <Button key="view" type="text" icon={<EyeOutlined />} onClick={() => navigate(`/product/${product.ProductID}`)}>
          Chi tiết
        </Button>
      ]}
    >
      <div style={{ marginBottom: '8px', minHeight: '44px' }}>
        <h3 
          onClick={() => navigate(`/product/${product.ProductID}`)}
          style={{ 
            fontSize: '15px', 
            fontWeight: '600', 
            margin: 0, 
            lineHeight: '1.4', 
            overflow: 'hidden', 
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical', 
            cursor: 'pointer', 
            color: '#262626' 
          }}
          onMouseOver={(e) => e.currentTarget.style.color = '#1890ff'}
          onMouseOut={(e) => e.currentTarget.style.color = '#262626'}
        >
          {product.ProductName}
        </h3>
      </div>

      <div style={{ marginBottom: '12px', flex: 1 }}>
        <Text type="secondary" style={{ fontSize: '13px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '40px' }}>
          {product.MarketingContent || "Sản phẩm công nghệ chính hãng chất lượng cao."}
        </Text>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <Text type="danger" strong style={{ fontSize: '16px' }}>{formatPrice(product.Price)}</Text>
        {product.Stock > 0 ? <Tag color="green" style={{marginRight: 0}}>Sẵn hàng</Tag> : <Tag color="red" style={{marginRight: 0}}>Hết hàng</Tag>}
      </div>
    </Card>
  );
};

export default ProductCard;