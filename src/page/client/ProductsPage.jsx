// src/page/client/ProductsPage.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Spin, Typography, Breadcrumb, Empty, Pagination } from 'antd';
import { HomeOutlined, AppstoreOutlined, SearchOutlined } from '@ant-design/icons'; // Thêm SearchOutlined

import ProductList from '../../components/product/ProductList';
import { getAllProducts } from '../../services/product';

const { Title } = Typography;

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const sortBy = searchParams.get('sort');
  const searchKeyword = searchParams.get('search'); // 🆕 Lấy từ khóa từ URL
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 8;

  // Reset về trang 1 nếu điều kiện lọc thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId, sortBy, searchKeyword]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Gọi API kèm theo searchKeyword
        const response = await getAllProducts({ 
            category_id: categoryId, 
            sort_by: sortBy,
            search: searchKeyword, // 👈 Truyền xuống service
            page: currentPage,
            limit: pageSize
        });
        
        setProducts(response.data);
        setTotal(response.total);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, sortBy, searchKeyword, currentPage]); 

  // Tạo tiêu đề động
  const getPageTitle = () => {
      if (searchKeyword) return `Kết quả tìm kiếm: "${searchKeyword}"`; // 🆕
      if (categoryId) return "Danh mục sản phẩm";
      if (sortBy === 'best_seller') return "Bán Chạy Nhất";
      if (sortBy === 'newest') return "Hàng Mới Về";
      return "Tất cả sản phẩm";
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item href="/"><HomeOutlined /></Breadcrumb.Item>
        <Breadcrumb.Item>
            {searchKeyword ? <SearchOutlined /> : <AppstoreOutlined />} 
            <span> {getPageTitle()}</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', minHeight: '60vh' }}>
        <Title level={3}>{getPageTitle()}</Title>

        {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
        ) : products.length > 0 ? (
            <>
                <ProductList products={products} />
                <div style={{ marginTop: 40, textAlign: 'center' }}>
                    <Pagination 
                        current={currentPage} 
                        total={total} 
                        pageSize={pageSize} 
                        onChange={onPageChange} 
                        showSizeChanger={false}
                    />
                </div>
            </>
        ) : (
            <Empty description={`Không tìm thấy sản phẩm nào khớp với "${searchKeyword || ''}"`} />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;