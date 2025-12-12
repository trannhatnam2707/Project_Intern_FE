import React from 'react';
import { Card, Button, Typography, Tag, message } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

// Nếu bạn đã có file utils này thì giữ nguyên import, nếu chưa thì xem phần ghi chú bên dưới
import { addToCart } from '../../utils/cart'; 

const { Text } = Typography;

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Hàm format giá tiền (Viết trực tiếp ở đây để đảm bảo chạy được ngay)
  const formatPrice = (price) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Ngăn không cho click lan ra Card (tránh chuyển trang)
    try {
        addToCart(product, 1); // Gọi hàm từ utils
        message.success(`Đã thêm ${product.ProductName} vào giỏ!`);
    } catch (error) {
        console.error("Lỗi thêm giỏ hàng:", error);
        message.error("Có lỗi khi thêm vào giỏ hàng");
    }
  };

  // Xử lý cắt chuỗi mô tả (Marketing Content)
  const truncate = (str, max) => {
      if (!str) return '';
      return str.length > max ? str.substring(0, max) + '...' : str;
  };

  // Nội dung Marketing mặc định nếu chưa có
  const marketingText = product.MarketingContent || "Sản phẩm công nghệ chính hãng chất lượng cao.";

  return (
    <Card
      hoverable
      style={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        borderRadius: '12px', 
        overflow: 'hidden', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        border: '1px solid #f0f0f0'
      }}
      bodyStyle={{ 
        flex: 1, 
        padding: '12px', 
        display: 'flex', 
        flexDirection: 'column' 
      }}
      onClick={() => navigate(`/product/${product.ProductID}`)}
      
      // 👇 KHUNG ẢNH CỐ ĐỊNH (Quan trọng)
      cover={
        <div style={{ 
            height: '200px',             // Chiều cao cố định
            padding: '15px',             // Khoảng hở an toàn
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: '#fff', 
            borderBottom: '1px solid #f0f0f0' 
        }}>
            <img
                alt={product.ProductName}
                src={product.ImageURL || "https://via.placeholder.com/300x300?text=No+Image"} 
                style={{ 
                    maxHeight: '100%',       // Không cao quá khung
                    maxWidth: '100%',        // Không rộng quá khung
                    objectFit: 'contain',    // Giữ nguyên tỉ lệ ảnh
                    transition: 'transform 0.3s' 
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
        </div>
      }
      
      // Các nút hành động bên dưới
      actions={[
        <Button key="cart" type="text" icon={<ShoppingCartOutlined />} onClick={handleAddToCart}>
           Thêm giỏ
        </Button>,
        <Button key="view" type="text" icon={<EyeOutlined />} onClick={() => navigate(`/product/${product.ProductID}`)}>
           Chi tiết
        </Button>
      ]}
    >
      {/* 1. Tên sản phẩm (Giới hạn 2 dòng) */}
      <div style={{ marginBottom: '8px', minHeight: '44px' }}>
        <h3 style={{ 
            fontSize: '15px', 
            fontWeight: '600', 
            margin: 0, 
            lineHeight: '1.4', 
            overflow: 'hidden', 
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical', 
            color: '#262626' 
        }}>
          {product.ProductName}
        </h3>
      </div>

      {/* 2. Mô tả Marketing (Cắt gọn) */}
      <div style={{ marginBottom: '12px', flex: 1 }}>
        <Text type="secondary" style={{ fontSize: '13px' }}>
          {truncate(marketingText, 60)}
        </Text>
      </div>

      {/* 3. Giá & Trạng thái (Đẩy xuống đáy) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <Text strong style={{ fontSize: '16px', color: '#ff4d4f' }}>
            {formatPrice(product.Price)}
        </Text>
        
        {product.Stock > 0 ? (
            <Tag color="success">Sẵn hàng</Tag>
        ) : (
            <Tag color="error">Hết hàng</Tag>
        )}
      </div>
    </Card>
  );
};

export default ProductCard;