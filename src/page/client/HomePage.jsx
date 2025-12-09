import React, { useEffect, useState } from 'react';
import { Carousel, Spin, Typography, message, Avatar, Row, Col, Divider } from 'antd';
import {   FireOutlined, StarOutlined, RocketOutlined, 
  LaptopOutlined, MobileOutlined, AppstoreOutlined, 
  ReadOutlined, DesktopOutlined, AudioOutlined
} from '@ant-design/icons';
import { MdWatch } from 'react-icons/md';

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

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getAllCategories()
        ]);
        setProducts(productsData || []);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error(error);
        message.error("Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCategoryIcon = (categoryName) => {
    if (!categoryName) return <AppstoreOutlined />;
    const name = categoryName.toLowerCase();
    if (name.includes('điện thoại')) return <MobileOutlined />;
    if (name.includes('laptop')) return <LaptopOutlined />;
    if (name.includes('đồng hồ')) return <MdWatch />;
    return <AppstoreOutlined />;
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px 0' }}><Spin size="large" /></div>;

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

      {/* 2. Danh mục */}
      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Title level={4} style={{ marginBottom: '20px', textAlign: 'center' }}>Danh Mục Nổi Bật</Title>
        <Row gutter={[16, 16]} justify="center">
          {categories.map((cat) => (
            <Col key={cat.CategoryID} span={4} xs={8} sm={6} md={4} style={{ textAlign: 'center' }}>
              <div 
                style={{ cursor: 'pointer', transition: 'all 0.3s', padding: '10px' }}
                onClick={() => navigate(`/products?category=${cat.CategoryID}`)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Avatar size={54} icon={getCategoryIcon(cat.CategoryName)} style={{ backgroundColor: '#e6f7ff', color: '#1890ff', marginBottom: '10px' }} />
                <div style={{ fontWeight: 500, fontSize: '14px' }}>{cat.CategoryName}</div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* 3. Các Section Sản phẩm (Sử dụng Component tái sử dụng ProductList) */}
      <ProductList 
        title="Sản Phẩm Bán Chạy" 
        icon={<FireOutlined style={{ color: '#ff4d4f' }} />} 
        products={products.slice(0, 4)} 
        viewAllLink="/products"
      />

      <ProductList 
        title="Sản Phẩm Mới Về" 
        icon={<RocketOutlined style={{ color: '#1890ff' }} />} 
        products={products.slice(4, 8)} 
        viewAllLink="/products"
      />

      <ProductList 
        title="Gợi Ý Cho Bạn" 
        icon={<StarOutlined style={{ color: '#faad14' }} />} 
        products={products.slice(8, 12)} 
        viewAllLink="/products"
      />

      <Divider style={{ borderColor: '#d9d9d9' }} />

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <Title level={2} style={{ color: '#001529' }}>Khám Phá Tất Cả</Title>
        <Text type="secondary">Tìm kiếm thiết bị công nghệ yêu thích của bạn</Text>
      </div>
      
      {/* Grid tổng */}
      <ProductList products={products} />

    </div>
  );
};

export default HomePage;