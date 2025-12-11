import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Image, Typography, Button, Rate, Tag, InputNumber, Divider, Space, message, Spin, Card, Breadcrumb, Modal } from 'antd';
import { ShoppingCartOutlined, ThunderboltOutlined, HomeOutlined, UserOutlined, PhoneOutlined, EnvironmentOutlined, InfoCircleOutlined, StarFilled } from '@ant-design/icons';

import { getProductById } from '../../services/product';
import { getReviewsByProduct } from '../../services/reviews';
import { createOrder } from '../../services/order';
import { createPaymentUrl } from '../../services/payment';
import { getMe } from '../../services/auth';
import { formatPrice } from '../../utils/format';
import { addToCart } from '../../utils/cart';
import ProductReviews from '../../components/product/ProductReviews';

const { Title, Paragraph, Text } = Typography;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
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

    const missingInfo = !user?.PhoneNumber || !user?.Address;

    Modal.confirm({
        title: 'Xác nhận đặt hàng',
        width: 600,
        content: (
            <div>
                <div style={{ marginBottom: 15, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
                    <Text strong>Sản phẩm:</Text>
                    <div style={{ display: 'flex', marginTop: 10, alignItems: 'center' }}>
                        <Image src={product.ImageURL} width={60} height={60} style={{objectFit: 'contain', border: '1px solid #ddd', borderRadius: 4}} preview={false} />
                        <div style={{ marginLeft: 15 }}>
                            <div style={{ fontWeight: 500 }}>{product.ProductName}</div>
                            <div style={{ fontSize: 13, color: '#888' }}>Số lượng: {quantity}</div>
                            <div style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{formatPrice(product.Price * quantity)}</div>
                        </div>
                    </div>
                </div>
                <div style={{ background: '#f5f7fa', padding: 15, borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <Text strong>Giao tới:</Text>
                        <Button type="link" size="small" onClick={() => { Modal.destroyAll(); navigate('/profile'); }}>Sửa</Button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14 }}>
                        <div><UserOutlined /> {user?.FullName}</div>
                        <div><PhoneOutlined /> {user?.PhoneNumber || <Text type="danger">Thiếu SĐT</Text>}</div>
                        <div><EnvironmentOutlined /> {user?.Address || <Text type="danger">Thiếu địa chỉ</Text>}</div>
                    </div>
                    {missingInfo && <div style={{ marginTop: 10, color: '#faad14', fontSize: 13 }}><InfoCircleOutlined /> Cần cập nhật thông tin.</div>}
                </div>
            </div>
        ),
        okText: missingInfo ? 'Cập nhật' : 'Thanh toán',
        cancelText: 'Hủy',
        okButtonProps: { danger: missingInfo },
        onOk: async () => {
            if (missingInfo) { navigate('/profile'); return; }
            try {
                const orderRes = await createOrder([{ product_id: product.ProductID, quantity: quantity }]);
                if (orderRes.order_id) {
                    const paymentRes = await createPaymentUrl(orderRes.order_id);
                    if (paymentRes.checkout_url) window.location.href = paymentRes.checkout_url;
                }
            } catch (error) { message.error("Lỗi đặt hàng!"); }
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
          {/* Cột trái: Ảnh */}
          <Col xs={24} md={10}>
            <div style={{ border: '1px solid #f0f0f0', borderRadius: '8px', padding: '20px', display: 'flex', justifyContent: 'center', backgroundColor: '#fff' }}>
              <Image src={product.ImageURL || "https://via.placeholder.com/500"} style={{ maxHeight: '400px', objectFit: 'contain' }} />
            </div>
          </Col>

          {/* Cột phải: Thông tin */}
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

            {/* --- PHẦN BẠN CẦN: HIỂN THỊ CẢ 2 NỘI DUNG --- */}
            
            {/* 1. MARKETING CONTENT (Nổi bật) */}
            {product.MarketingContent && (
                <div style={{ marginBottom: '20px', padding: '12px 16px', background: '#e6f7ff', borderRadius: '6px', borderLeft: '4px solid #1890ff' }}>
                    <Text strong style={{ color: '#0050b3' }}><StarFilled /> Điểm nổi bật:</Text>
                    <Paragraph style={{ margin: '8px 0 0', color: '#003a8c', fontStyle: 'italic' }}>
                        "{product.MarketingContent}"
                    </Paragraph>
                </div>
            )}

            {/* 2. DESCRIPTION (Chi tiết) */}
            <div style={{ marginBottom: 24 }}>
                <Title level={5}>Mô tả chi tiết:</Title>
                <Paragraph style={{ whiteSpace: 'pre-line', color: '#595959' }}>
                    {product.Description || "Đang cập nhật mô tả..."}
                </Paragraph>
            </div>

            <Divider />

            {/* Nút mua hàng */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Space><Text strong>Số lượng:</Text><InputNumber min={1} max={product.Stock} defaultValue={1} onChange={setQuantity} size="large" /></Space>
                <Space size="middle" wrap>
                    <Button type="primary" size="large" icon={<ShoppingCartOutlined />} onClick={handleAddToCart} style={{ height: '50px', padding: '0 30px' }} disabled={product.Stock === 0}>Thêm vào giỏ</Button>
                    <Button type="primary" danger size="large" icon={<ThunderboltOutlined />} onClick={handleBuyNow} style={{ height: '50px', padding: '0 40px' }} disabled={product.Stock === 0}>Mua ngay</Button>
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