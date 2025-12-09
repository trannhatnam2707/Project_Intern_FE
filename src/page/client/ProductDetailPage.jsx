import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Image, Typography, Button, Rate, Tag, InputNumber, Divider, Space, message, Spin, Card, Breadcrumb, Modal } from 'antd';
import { ShoppingCartOutlined, CheckCircleOutlined, HomeOutlined, ThunderboltOutlined } from '@ant-design/icons';

import { getProductById } from '../../services/product';
import { getReviewsByProduct } from '../../services/reviews';
import { createOrder } from '../../services/order';
// 👇 Đảm bảo import hàm này
import { createPaymentUrl } from '../../services/payment'; 
import { formatPrice } from '../../utils/format';
import { addToCart } from '../../utils/cart';
import ProductReviews from '../../components/product/ProductReviews';

const { Title, Paragraph, Text } = Typography;

const ProductDetailPage = () => {
  // ... (Phần state và useEffect giữ nguyên) ...
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const isAuthenticated = !!(localStorage.getItem("access_token"));

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
        // ... (Giữ nguyên logic fetch data) ...
        try {
          setLoading(true);
          const [productData, reviewsData] = await Promise.all([getProductById(id), getReviewsByProduct(id)]);
          setProduct(productData);
          setReviews(reviewsData);
          if (reviewsData.length > 0) {
              const total = reviewsData.reduce((acc, curr) => acc + curr.Rating, 0);
              setAvgRating(total / reviewsData.length);
          } else { setAvgRating(5); }
        } catch (error) { message.error("Lỗi tải dữ liệu!"); } finally { setLoading(false); }
    };
    if (id) fetchData();
  }, [id]);

  const handleAddToCart = () => {
    if (quantity > product.Stock) {
        message.warning("Số lượng yêu cầu vượt quá tồn kho!");
        return;
    }
    addToCart(product, quantity);
    message.success(`Đã thêm ${quantity} sản phẩm vào giỏ!`);
  };

  // 👇 HÀM NÀY CẦN SỬA LẠI ĐỂ GỌI STRIPE
  const handleBuyNow = () => {
    if (!isAuthenticated) {
        message.warning("Vui lòng đăng nhập để mua hàng!");
        navigate("/login");
        return;
    }
    if (quantity > product.Stock) {
        message.warning("Số lượng yêu cầu vượt quá tồn kho!");
        return;
    }

    Modal.confirm({
        title: 'Xác nhận mua ngay',
        content: (
            <div>
                <p>Bạn muốn đặt mua ngay sản phẩm này?</p>
                <div style={{ marginTop: 10, padding: 10, background: '#f5f5f5', borderRadius: 6 }}>
                    <p style={{ margin: 0 }}><b>{product.ProductName}</b></p>
                    <p style={{ margin: '5px 0' }}>Số lượng: {quantity}</p>
                    <p style={{ margin: 0, color: 'red', fontWeight: 'bold' }}>
                        Thành tiền: {formatPrice(product.Price * quantity)}
                    </p>
                </div>
            </div>
        ),
        okText: 'Thanh toán ngay',
        cancelText: 'Hủy',
        onOk: async () => {
            try {
                // 1. Tạo đơn hàng
                const orderRes = await createOrder([{ product_id: product.ProductID, quantity: quantity }]);
                
                // 2. Nếu có Order ID -> Tạo link thanh toán
                if (orderRes.order_id) {
                    const paymentRes = await createPaymentUrl(orderRes.order_id);
                    
                    if (paymentRes.checkout_url) {
                        // 🚀 CHUYỂN HƯỚNG SANG STRIPE
                        window.location.href = paymentRes.checkout_url;
                    } else {
                        message.error("Lỗi: Không tạo được link thanh toán.");
                    }
                }
            } catch (error) {
                message.error("Đặt hàng thất bại: " + (error.response?.data?.detail || "Lỗi hệ thống"));
            }
        }
    });
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (!product) return null;

  return (
    <div style={{ paddingBottom: '40px' }}>
        {/* ... (Phần UI giữ nguyên như cũ) ... */}
        <Breadcrumb style={{ margin: '16px 0' }} items={[{ href: '/', title: <HomeOutlined /> }, { title: 'Sản phẩm' }, { title: product.ProductName }]} />
      <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Row gutter={[48, 32]}>
          <Col xs={24} md={10}>
            <div style={{ border: '1px solid #f0f0f0', borderRadius: '8px', padding: '20px', display: 'flex', justifyContent: 'center', backgroundColor: '#fff' }}>
              <Image src={product.ImageURL || "https://via.placeholder.com/500"} style={{ maxHeight: '400px', objectFit: 'contain' }} />
            </div>
          </Col>

          <Col xs={24} md={14}>
            <Title level={2} style={{ marginBottom: 10 }}>{product.ProductName}</Title>
            
            <Space style={{ marginBottom: 20 }}>
                <Rate disabled allowHalf value={avgRating} style={{ fontSize: 14, color: '#faad14' }} />
                <Text type="secondary">({reviews.length} đánh giá)</Text>
                <Divider type="vertical" />
                {product.Stock > 0 ? <Tag color="success" icon={<CheckCircleOutlined />}>Còn hàng (Stock: {product.Stock})</Tag> : <Tag color="error">Hết hàng</Tag>}
            </Space>

            <div style={{ background: '#fafafa', padding: '15px', borderRadius: '8px', marginBottom: '24px' }}>
                <Text type="danger" style={{ fontSize: '32px', fontWeight: 'bold' }}>{formatPrice(product.Price)}</Text>
            </div>

            <div style={{ marginBottom: '24px' }}>
                <Title level={5}>Đặc điểm nổi bật:</Title>
                <Paragraph style={{ fontSize: '15px', color: '#555', lineHeight: '1.6' }}>
                    {product.MarketingContent || product.Description || "Đang cập nhật thông tin chi tiết..."}
                </Paragraph>
            </div>

            <Divider />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Space>
                    <Text strong>Số lượng:</Text>
                    <InputNumber min={1} max={product.Stock} defaultValue={1} onChange={setQuantity} size="large" />
                </Space>

                <Space size="middle" wrap>
                    <Button 
                        type="primary" size="large" icon={<ShoppingCartOutlined />} 
                        onClick={handleAddToCart}
                        style={{ height: '50px', padding: '0 30px', borderRadius: '8px', background: '#1890ff' }}
                        disabled={product.Stock === 0}
                    >
                        Thêm vào giỏ
                    </Button>

                    <Button 
                        type="primary" danger size="large" icon={<ThunderboltOutlined />} 
                        onClick={handleBuyNow}
                        style={{ height: '50px', padding: '0 40px', borderRadius: '8px', fontWeight: 'bold' }}
                        disabled={product.Stock === 0}
                    >
                        Mua ngay
                    </Button>
                </Space>
            </div>
          </Col>
        </Row>
      </Card>

      <ProductReviews productId={id} reviews={reviews} setReviews={setReviews} setAvgRating={setAvgRating} isAuthenticated={isAuthenticated} />
    </div>
  );
};

export default ProductDetailPage;