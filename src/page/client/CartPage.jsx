import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, message, Modal, Result, Button, Card } from 'antd'; // Import thêm Card
import { ShoppingOutlined, UserOutlined, PhoneOutlined, EnvironmentOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import CartList from '../../components/cart/CartList';
import CartSummary from '../../components/cart/CartSummary';

import { getCart, updateCartQuantity, removeFromCart } from '../../utils/cart';
import { createOrder } from '../../services/order';
import { createPaymentUrl } from '../../services/payment';
import { getMe } from '../../services/auth'; // 🆕 Import getMe

const { Title, Text } = Typography;

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // 🆕 State user
  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(getCart());
    // 🆕 Lấy thông tin user
    const token = localStorage.getItem("access_token");
    if (token) {
        getMe().then(data => setUser(data)).catch(() => {});
    }
  }, []);

  const handleQuantityChange = (productId, newQuantity) => {
    const updatedCart = updateCartQuantity(productId, newQuantity);
    setCartItems(updatedCart);
  };

  const handleRemove = (productId) => {
    // ... (Giữ nguyên logic xóa)
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn muốn xóa sản phẩm này?',
      okType: 'danger',
      onOk: () => {
        const updatedCart = removeFromCart(productId);
        setCartItems(updatedCart);
        setSelectedRowKeys(prev => prev.filter(id => id !== productId));
        message.success('Đã xóa');
      },
    });
  };

  const onSelectionChange = (keys) => setSelectedRowKeys(keys);
  const selectedItems = cartItems.filter(item => selectedRowKeys.includes(item.ProductID));

  // 👇 HÀM CHECKOUT MỚI
  const handleCheckout = async () => {
    if (!localStorage.getItem("access_token")) return navigate("/login");
    if (selectedItems.length === 0) return message.warning("Chưa chọn sản phẩm nào!");

    // Kiểm tra thông tin
    const missingInfo = !user?.PhoneNumber || !user?.Address;

    Modal.confirm({
        title: 'Xác nhận thanh toán',
        width: 600,
        content: (
            <div>
                <p>Bạn đang thanh toán cho <b>{selectedItems.length} sản phẩm</b> đã chọn.</p>
                
                {/* Thông tin giao hàng */}
                <div style={{ background: '#f5f7fa', padding: 15, borderRadius: 8, marginTop: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <Text strong>Giao tới:</Text>
                        <Button type="link" size="small" onClick={() => { Modal.destroyAll(); navigate('/profile'); }}>Sửa</Button>
                    </div>
                    <div style={{ fontSize: 14 }}>
                        <p style={{ margin: 4 }}><UserOutlined /> {user?.FullName}</p>
                        <p style={{ margin: 4 }}><PhoneOutlined /> {user?.PhoneNumber || <Text type="danger">Thiếu SĐT</Text>}</p>
                        <p style={{ margin: 4 }}><EnvironmentOutlined /> {user?.Address || <Text type="danger">Thiếu địa chỉ</Text>}</p>
                    </div>
                    {missingInfo && <div style={{color:'#faad14', marginTop:5}}><InfoCircleOutlined/> Cần cập nhật thông tin!</div>}
                </div>
            </div>
        ),
        okText: missingInfo ? 'Cập nhật hồ sơ' : 'Thanh toán ngay',
        okButtonProps: { danger: missingInfo },
        onOk: async () => {
            if (missingInfo) {
                navigate('/profile');
                return;
            }
            
            // Logic tạo đơn & thanh toán cũ
            try {
                setLoading(true);
                const itemsPayload = selectedItems.map(item => ({ product_id: item.ProductID, quantity: item.quantity }));
                const orderRes = await createOrder(itemsPayload);
                
                if (orderRes.order_id) {
                    const paymentRes = await createPaymentUrl(orderRes.order_id);
                    if (paymentRes.checkout_url) {
                        const itemsToRemove = selectedItems.map(item => item.ProductID);
                        sessionStorage.setItem('pending_payment_items', JSON.stringify(itemsToRemove));
                        window.location.href = paymentRes.checkout_url;
                    }
                }
            } catch (error) {
                message.error("Lỗi: " + (error.response?.data?.detail || "Hệ thống bận"));
            } finally {
                setLoading(false);
            }
        }
    });
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      <Title level={2} style={{ marginBottom: '20px' }}><ShoppingOutlined /> Giỏ hàng</Title>
      {cartItems.length > 0 ? (
        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <CartList 
                cartItems={cartItems} 
                onQuantityChange={handleQuantityChange} 
                onRemove={handleRemove}
                selectedRowKeys={selectedRowKeys}
                onSelectionChange={onSelectionChange}
            />
          </Col>
          <Col xs={24} lg={8}>
            <CartSummary 
                selectedItems={selectedItems} 
                onCheckout={handleCheckout} 
                loading={loading}
            />
          </Col>
        </Row>
      ) : (
        <Result status="404" title="Giỏ hàng trống" extra={<Button type="primary" onClick={() => navigate('/')}>Mua sắm ngay</Button>} />
      )}
    </div>
  );
};

export default CartPage;