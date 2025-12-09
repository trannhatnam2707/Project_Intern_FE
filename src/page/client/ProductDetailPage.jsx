import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Image, Typography, Button, Rate, Tag, InputNumber, Divider, Space, message, Spin, Card, Breadcrumb, Modal } from 'antd';
import { ShoppingCartOutlined, CheckCircleOutlined, HomeOutlined, ThunderboltOutlined, UserOutlined, PhoneOutlined, EnvironmentOutlined, InfoCircleOutlined } from '@ant-design/icons';

import { getProductById } from '../../services/product';
import { getReviewsByProduct } from '../../services/reviews';
import { createOrder } from '../../services/order';
import { createPaymentUrl } from '../../services/payment';
import { getMe } from '../../services/auth'; // 👇 Import API lấy thông tin user
import { formatPrice } from '../../utils/format';
import { addToCart } from '../../utils/cart';
import ProductReviews from '../../components/product/ProductReviews';

const { Title, Paragraph, Text } = Typography;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null); // 🆕 State lưu thông tin user
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const isAuthenticated = !!(localStorage.getItem("access_token"));

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productData, reviewsData] = await Promise.all([
            getProductById(id),
            getReviewsByProduct(id)
        ]);
        setProduct(productData);
        setReviews(reviewsData);

        // 🆕 Lấy thông tin User mới nhất (để có SĐT, Địa chỉ)
        if (isAuthenticated) {
            const userData = await getMe();
            setUser(userData);
        }

        if (reviewsData.length > 0) {
            const total = reviewsData.reduce((acc, curr) => acc + curr.Rating, 0);
            setAvgRating(total / reviewsData.length);
        } else { setAvgRating(5); }

      } catch (error) {
        console.error(error);
        message.error("Lỗi tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id, isAuthenticated]);

  const handleAddToCart = () => {
    if (quantity > product.Stock) return message.warning("Không đủ hàng!");
    addToCart(product, quantity);
    message.success(`Đã thêm ${quantity} sản phẩm vào giỏ!`);
  };

  // 👇 HÀM MUA NGAY ĐƯỢC NÂNG CẤP
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

    // Kiểm tra thiếu thông tin
    const missingInfo = !user?.PhoneNumber || !user?.Address;

    Modal.confirm({
        title: 'Xác nhận đặt hàng',
        width: 600,
        content: (
            <div>
                {/* 1. Thông tin sản phẩm */}
                <div style={{ marginBottom: 15, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
                    <Text strong>Sản phẩm đặt mua:</Text>
                    <div style={{ display: 'flex', marginTop: 10, alignItems: 'center' }}>
                        <Image src={product.ImageURL} width={60} height={60} style={{objectFit: 'contain', border: '1px solid #ddd', borderRadius: 4}} preview={false} />
                        <div style={{ marginLeft: 15 }}>
                            <div style={{ fontWeight: 500 }}>{product.ProductName}</div>
                            <div style={{ fontSize: 13, color: '#888' }}>Số lượng: {quantity}</div>
                            <div style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{formatPrice(product.Price * quantity)}</div>
                        </div>
                    </div>
                </div>

                {/* 2. Thông tin giao hàng */}
                <div style={{ background: '#f5f7fa', padding: 15, borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <Text strong>Thông tin giao hàng:</Text>
                        <Button type="link" size="small" onClick={() => { Modal.destroyAll(); navigate('/profile'); }}>Sửa</Button>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14 }}>
                        <div><UserOutlined /> <span style={{ marginLeft: 8 }}>{user?.FullName}</span></div>
                        
                        <div>
                            <PhoneOutlined /> 
                            <span style={{ marginLeft: 8 }}>
                                {user?.PhoneNumber || <Text type="danger">Chưa cập nhật số điện thoại</Text>}
                            </span>
                        </div>
                        
                        <div>
                            <EnvironmentOutlined /> 
                            <span style={{ marginLeft: 8 }}>
                                {user?.Address || <Text type="danger">Chưa cập nhật địa chỉ nhận hàng</Text>}
                            </span>
                        </div>
                    </div>

                    {missingInfo && (
                        <div style={{ marginTop: 10, color: '#faad14', fontSize: 13 }}>
                            <InfoCircleOutlined /> Vui lòng cập nhật thông tin trước khi thanh toán.
                        </div>
                    )}
                </div>
            </div>
        ),
        okText: missingInfo ? 'Cập nhật ngay' : 'Thanh toán',
        cancelText: 'Hủy bỏ',
        okButtonProps: { danger: missingInfo }, // Nếu thiếu info thì nút màu đỏ
        onOk: async () => {
            // Nếu thiếu info -> Chuyển sang trang Profile
            if (missingInfo) {
                navigate('/profile');
                return;
            }

            try {
                const orderRes = await createOrder([{ product_id: product.ProductID, quantity: quantity }]);
                if (orderRes.order_id) {
                    const paymentRes = await createPaymentUrl(orderRes.order_id);
                    if (paymentRes.checkout_url) window.location.href = paymentRes.checkout_url;
                }
            } catch (error) {
                message.error("Lỗi đặt hàng: " + (error.response?.data?.detail || "Hệ thống bận"));
            }
        }
    });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px 0' }}><Spin size="large" /></div>;
  if (!product) return null;

  return (
    <div style={{ paddingBottom: '40px' }}>
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
                {product.Stock > 0 ? <Tag color="success">Còn hàng ({product.Stock})</Tag> : <Tag color="error">Hết hàng</Tag>}
            </Space>
            <div style={{ background: '#fafafa', padding: '15px', borderRadius: '8px', marginBottom: '24px' }}>
                <Text type="danger" style={{ fontSize: '32px', fontWeight: 'bold' }}>{formatPrice(product.Price)}</Text>
            </div>
            <div style={{ marginBottom: 24 }}><Paragraph>{product.MarketingContent || product.Description}</Paragraph></div>
            <Divider />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Space><Text strong>Số lượng:</Text><InputNumber min={1} max={product.Stock} defaultValue={1} onChange={setQuantity} size="large" /></Space>
                <Space size="middle" wrap>
                    <Button type="primary" size="large" icon={<ShoppingCartOutlined />} onClick={handleAddToCart} style={{ height: '50px', padding: '0 30px', background: '#1890ff' }} disabled={product.Stock === 0}>Thêm vào giỏ</Button>
                    <Button type="primary" danger size="large" icon={<ThunderboltOutlined />} onClick={handleBuyNow} style={{ height: '50px', padding: '0 40px', fontWeight: 'bold' }} disabled={product.Stock === 0}>Mua ngay</Button>
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