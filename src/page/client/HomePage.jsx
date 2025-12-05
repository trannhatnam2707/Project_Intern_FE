import React, { useEffect, useState } from 'react';
import { Carousel, Card, Col, Row, Spin, Typography, Button, message, Image, Tag, Divider, Avatar } from 'antd';
import { 
  ShoppingCartOutlined, 
  EyeOutlined, 
  FireOutlined, 
  StarOutlined, 
  RocketOutlined, 
  LaptopOutlined, 
  MobileOutlined, 
  AppstoreOutlined,
  ReadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../../services/product';

const { Title, Text } = Typography;

// --- DỮ LIỆU CẤU HÌNH (MOCK DATA CHO UI) ---
const banners = [
  "https://img.freepik.com/free-vector/horizontal-banner-template-big-sale-with-woman-shopping-bags_23-2148786422.jpg?w=1380",
  "https://img.freepik.com/free-vector/flat-horizontal-sale-banner-template-with-photo_23-2149000923.jpg?w=1380",
  "https://img.freepik.com/free-vector/ecommerce-web-banner-template_23-2149559191.jpg?w=1380"
];

const categories = [
  { id: 1, name: "Điện thoại", icon: <MobileOutlined /> },
  { id: 2, name: "Laptop", icon: <LaptopOutlined /> },
  { id: 3, name: "Đồng hồ", icon: <StarOutlined /> },
  { id: 4, name: "Phụ kiện", icon: <AppstoreOutlined /> },
  { id: 5, name: "Tablet", icon: <RocketOutlined /> },
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. Fetch dữ liệu
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

  // 2. Hàm format giá
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // --- COMPONENT CON: THẺ SẢN PHẨM (CARD) ---
  const ProductCard = ({ product }) => (
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
            onClick={() => navigate(`/product/${product.ProductID}`)} // Click ảnh cũng chuyển trang
            cursor="pointer"
          />
        </div>
      }
      actions={[
        <Button type="text" icon={<ShoppingCartOutlined key="cart" />} onClick={() => message.success("Đã thêm vào giỏ!")}>
          Thêm giỏ
        </Button>,
        <Button type="text" icon={<EyeOutlined key="view" />} onClick={() => navigate(`/product/${product.ProductID}`)}>
          Chi tiết
        </Button>
      ]}
    >
      {/* Tên sản phẩm */}
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

      {/* Marketing Content (Logic từ Bản 1) */}
      <div style={{ marginBottom: '12px', flex: 1 }}>
        <Text type="secondary" style={{ 
          fontSize: '13px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '40px' 
        }}>
          {product.MarketingContent || "Sản phẩm công nghệ chính hãng chất lượng cao, bảo hành dài hạn."}
        </Text>
      </div>

      {/* Giá và Tồn kho (Logic từ Bản 1) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <Text type="danger" strong style={{ fontSize: '16px' }}>
          {formatPrice(product.Price)}
        </Text>
        {product.Stock > 0 ? (
          <Tag color="green" style={{marginRight: 0}}>Sẵn hàng</Tag>
        ) : (
          <Tag color="red" style={{marginRight: 0}}>Hết hàng</Tag>
        )}
      </div>
    </Card>
  );

  // --- CÁC SECTION UI (Từ Bản 2) ---

  const renderBanner = () => (
    <div style={{ marginBottom: 30, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <Carousel autoplay draggable>
        {banners.map((img, index) => (
          <div key={index}>
            <div style={{ 
              height: '380px', 
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Overlay mờ nếu ảnh không load được hoặc để trang trí */}
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );

  const renderCategories = () => (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <Title level={4} style={{ marginBottom: '20px', textAlign: 'center' }}>Danh Mục</Title>
      <Row gutter={[16, 16]} justify="center">
        {categories.map((cat) => (
          <Col key={cat.id} span={4} xs={8} sm={6} md={4} style={{ textAlign: 'center' }}>
            <div 
              style={{ cursor: 'pointer', transition: 'all 0.3s', padding: '10px' }}
              onClick={() => navigate(`/products?category=${cat.id}`)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Avatar 
                size={54} 
                icon={cat.icon} 
                style={{ backgroundColor: '#e6f7ff', color: '#1890ff', marginBottom: '10px' }} 
              />
              <div style={{ fontWeight: 500, fontSize: '14px' }}>{cat.name}</div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );

  const ProductSection = ({ title, icon, data, link }) => (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
        <Title level={3} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: '#001529' }}>
          {icon} {title}
        </Title>
        <Button type="link" onClick={() => navigate(link || '/products')} style={{ fontSize: '14px' }}>Xem tất cả &gt;</Button>
      </div>
      <Row gutter={[20, 20]}>
        {data.map((product) => (
          <Col key={product.ProductID} xs={24} sm={12} md={8} lg={6}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </div>
  );

  // --- RENDER CHÍNH ---

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '100px 0', minHeight: '80vh' }}>
      <Spin size="large" tip="Đang tải dữ liệu..." />
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* 1. Banner Slider */}
      {renderBanner()}

      {/* 2. Danh mục */}
      {renderCategories()}

      {products.length > 0 ? (
        <>
          {/* 3. Sản phẩm bán chạy (Lấy 4 sản phẩm đầu) */}
          <ProductSection 
            title="Sản Phẩm Bán Chạy" 
            icon={<FireOutlined style={{ color: '#ff4d4f' }} />}
            data={products.slice(0, 4)} 
          />

          {/* 4. Sản phẩm mới (Lấy 4 sản phẩm tiếp theo) */}
          <ProductSection 
            title="Sản Phẩm Mới Về" 
            icon={<RocketOutlined style={{ color: '#1890ff' }} />}
            data={products.slice(4, 8)} 
          />

          {/* 5. Gợi ý cho bạn (Lấy 4 sản phẩm tiếp theo) */}
          <ProductSection 
            title="Gợi Ý Cho Bạn" 
            icon={<StarOutlined style={{ color: '#faad14' }} />}
            data={products.slice(8, 12)} 
          />

          <Divider style={{ borderColor: '#d9d9d9' }} />

          {/* 6. Tất cả sản phẩm (Hiển thị hết) */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <Title level={2} style={{ color: '#001529' }}>Khám Phá Tất Cả</Title>
            <Text type="secondary">Tìm kiếm thiết bị công nghệ yêu thích của bạn</Text>
          </div>
          
          <Row gutter={[20, 20]}>
            {products.map((product) => (
              <Col key={product.ProductID} xs={24} sm={12} md={8} lg={6}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Text type="secondary">Chưa có sản phẩm nào trong hệ thống.</Text>
        </div>
      )}
    </div>
  );
};

export default HomePage;