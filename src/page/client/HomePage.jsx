import React, { useEffect, useState } from 'react';
import { Carousel, Spin, Typography, message, Avatar, Row, Col, Divider } from 'antd';
import { FireOutlined, StarOutlined, RocketOutlined, AppstoreOutlined, MobileOutlined, LaptopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { getAllProducts } from '../../services/product';
import { getAllCategories } from '../../services/category';
import ProductList from '../../components/product/ProductList';

const { Title, Text } = Typography;
const banners = ["https://img.freepik.com/free-vector/horizontal-banner-template-big-sale-with-woman-shopping-bags_23-2148786422.jpg?w=1380", "https://img.freepik.com/free-vector/flat-horizontal-sale-banner-template-with-photo_23-2149000923.jpg?w=1380"];

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  
  // 3 State riêng biệt cho 3 mục
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
        
        // 👇 SỬA Ở ĐÂY: Lấy .data từ response
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
      {/* Banner & Categories giữ nguyên */}
      <div style={{ marginBottom: 30, borderRadius: '12px', overflow: 'hidden' }}>
        <Carousel autoplay>
          {banners.map((img, i) => <div key={i}><div style={{ height: '380px', backgroundImage: `url(${img})`, backgroundSize: 'cover' }} /></div>)}
        </Carousel>
      </div>

      {/* 1. Sản phẩm Bán chạy */}
      <ProductList 
        title="Sản Phẩm Bán Chạy" 
        icon={<FireOutlined style={{ color: 'red' }} />} 
        products={bestSellers} 
        viewAllLink="/products?sort=best_seller" // 👈 Link xem tất cả đúng chuẩn
      />

      {/* 2. Sản phẩm Mới về */}
      <ProductList 
        title="Sản Phẩm Mới Về" 
        icon={<RocketOutlined style={{ color: 'blue' }} />} 
        products={newArrivals} 
        viewAllLink="/products?sort=newest" // 👈 Link xem tất cả đúng chuẩn
      />

      {/* 3. Gợi ý cho bạn */}
      <ProductList 
        title="Gợi Ý Cho Bạn" 
        icon={<StarOutlined style={{ color: '#faad14' }} />} 
        products={recommendations} 
        viewAllLink="/products?sort=price_desc" // 👈 Link xem tất cả đúng chuẩn
      />
      
      <Divider />
      <div style={{textAlign:'center', marginBottom: 20}}>
          <Title level={3}>Khám phá tất cả</Title>
          <a onClick={() => navigate('/products')}>Xem toàn bộ kho hàng</a>
      </div>
    </div>
  );
};

export default HomePage;