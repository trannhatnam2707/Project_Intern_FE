import React, { useEffect, useState } from 'react';
import { Carousel, Spin, Typography, Row, Col, Divider, Avatar } from 'antd';
import { 
    FireOutlined, StarOutlined, RocketOutlined, AppstoreOutlined, 
    MobileOutlined, LaptopOutlined, TabletOutlined, DesktopOutlined, 
    AudioOutlined, CameraOutlined, PrinterOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { getAllProducts } from '../../services/product';
import { getAllCategories } from '../../services/category';
import ProductList from '../../components/product/ProductList';

const { Title, Text } = Typography;

const banners = [
  "https://media.licdn.com/dms/image/v2/C5112AQEge5XaAe0-9w/article-inline_image-shrink_400_744/article-inline_image-shrink_400_744/0/1520191002197?e=1766620800&v=beta&t=iBInS-0DZ-H757k7NBcxHLz-XlUjIe53KUlVAeuf10o",
  "https://dknstore.vn/wp-content/uploads/2022/04/banner-dkn-store-01.jpg",
  "https://saolaptop.vn/wp-content/uploads/2021/04/tranphat_banner1_1_1587567515.jpg"
];

const getCategoryIcon = (categoryName) => {
    const name = categoryName ? categoryName.toLowerCase() : "";
    if (name.includes('điện thoại') || name.includes('phone')) return <MobileOutlined />;
    if (name.includes('laptop') || name.includes('máy tính')) return <LaptopOutlined />
    return <AppstoreOutlined />;
};

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catsData, bestRes, newRes, recRes] = await Promise.all([
            getAllCategories(),
            getAllProducts({ sort_by: 'best_seller', limit: 4 }),
            getAllProducts({ sort_by: 'newest', limit: 4 }),
            getAllProducts({ sort_by: 'price_desc', limit: 4 })
        ]);

        setCategories(catsData || []);
        setBestSellers(bestRes?.data || []);
        setNewArrivals(newRes?.data || []);
        setRecommendations(recRes?.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}><Spin size="large" /></div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* 1. Banner */}
      <div style={{ marginBottom: 30, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Carousel autoplay draggable>
          {banners.map((img, index) => (
            <div key={index}><div style={{ height: '380px', backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} /></div>
          ))}
        </Carousel>
      </div>

      {/* 2. Danh Mục SẢN PHẨM */}
      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Title level={4} style={{ marginBottom: '20px', textAlign: 'center', textTransform: 'uppercase' }}>
            Danh Mục Nổi Bật
        </Title>
        <Row gutter={[16, 16]} justify="center">
          {categories.map((cat) => (
            <Col key={cat.CategoryID} span={4} xs={12} sm={8} md={6} lg={4} style={{ textAlign: 'center' }}>
              <div 
                style={{ cursor: 'pointer', transition: 'all 0.3s', padding: '15px', borderRadius: '8px' }}
                onClick={() => navigate(`/products?category=${cat.CategoryID}`)}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Avatar 
                    size={64} 
                    icon={getCategoryIcon(cat.CategoryName)} 
                    style={{ backgroundColor: '#e6f7ff', color: '#1890ff', marginBottom: '10px', fontSize: '24px' }} 
                />
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#555' }}>{cat.CategoryName}</div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* 3. Các mục sản phẩm */}
      <ProductList 
        title="Sản Phẩm Bán Chạy" 
        icon={<FireOutlined style={{ color: 'red' }} />} 
        products={bestSellers} 
        viewAllLink="/products?sort=best_seller" 
      />

      <ProductList 
        title="Sản Phẩm Mới Về" 
        icon={<RocketOutlined style={{ color: 'blue' }} />} 
        products={newArrivals} 
        viewAllLink="/products?sort=newest" 
      />

      <ProductList 
        title="Gợi Ý Cho Bạn" 
        icon={<StarOutlined style={{ color: '#faad14' }} />} 
        products={recommendations} 
        viewAllLink="/products?sort=price_desc" 
      />
      
      <Divider />
      
      {/* 4. Footer CTA (Phần bạn muốn sửa) */}
      <div style={{textAlign:'center', marginBottom: 20, padding: '40px', background: '#f5f5f5', borderRadius: 12}}>
          <Title level={3}>Bạn chưa tìm thấy sản phẩm ưng ý?</Title>
          <Text type="secondary" style={{display: 'block', marginBottom: 10}}>
            Khám phá kho hàng khổng lồ của chúng tôi ngay hôm nay
          </Text>
          
          {/* 👇 SỬA Ở ĐÂY: Thêm marginTop và display: inline-block */}
          <a 
            onClick={() => navigate('/products')} 
            style={{ 
                display: 'inline-block', // Giúp thẻ a nhận margin dọc
                marginTop: '20px',       // Tạo khoảng cách 20px
                padding: '12px 30px', 
                background: '#1890ff', 
                color: '#fff', 
                borderRadius: '6px', 
                fontWeight: 'bold', 
                fontSize: '16px', 
                cursor: 'pointer' 
            }}
          >
            Xem Tất Cả Sản Phẩm
          </a>
      </div>
    </div>
  );
};

export default HomePage;