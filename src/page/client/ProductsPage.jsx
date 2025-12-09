import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Spin, Typography, Breadcrumb, Empty, Pagination, Row, Col } from 'antd'; // Import Pagination
import { HomeOutlined, AppstoreOutlined } from '@ant-design/icons';

import ProductList from '../../components/product/ProductList';
import { getAllProducts } from '../../services/product';

const { Title } = Typography;

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const sortBy = searchParams.get('sort');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🆕 State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 12; // Số sản phẩm mỗi trang

  useEffect(() => {
    // Reset về trang 1 khi đổi danh mục hoặc bộ lọc
    setCurrentPage(1);
  }, [categoryId, sortBy]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Gọi API với page và limit
        const response = await getAllProducts({ 
            category_id: categoryId, 
            sort_by: sortBy,
            page: currentPage,
            limit: pageSize
        });
        
        // 🆕 Cập nhật dữ liệu từ cấu trúc mới { data, total }
        setProducts(response.data);
        setTotal(response.total);

      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, sortBy, currentPage]); // Chạy lại khi đổi trang

  // Hàm đổi trang
  const onPageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Cuộn lên đầu
  };

  const getPageTitle = () => {
      if (categoryId) return "Sản phẩm theo danh mục";
      if (sortBy === 'best_seller') return "Top Bán Chạy Nhất";
      if (sortBy === 'newest') return "Sản Phẩm Mới Về";
      return "Tất cả sản phẩm";
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item href="/"><HomeOutlined /></Breadcrumb.Item>
        <Breadcrumb.Item><AppstoreOutlined /> <span> {getPageTitle()}</span></Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', minHeight: '60vh' }}>
        <Title level={3}>{getPageTitle()}</Title>

        {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
        ) : products.length > 0 ? (
            <>
                <ProductList products={products} />
                
                {/* 👇 THANH PHÂN TRANG */}
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
            <Empty description="Không tìm thấy sản phẩm nào" />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;