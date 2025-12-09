import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, message, Modal, Result, Button } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import CartList from '../../components/cart/CartList';
import CartSummary from '../../components/cart/CartSummary';

import { getCart, updateCartQuantity, removeFromCart, clearCart } from '../../utils/cart';
import { createOrder } from '../../services/order';
// 👇 Đảm bảo đã import hàm này
import { createPaymentUrl } from '../../services/payment';

const { Title } = Typography;

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const handleQuantityChange = (productId, newQuantity) => {
    const updatedCart = updateCartQuantity(productId, newQuantity);
    setCartItems(updatedCart);
  };

  const handleRemove = (productId) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn muốn xóa sản phẩm này khỏi giỏ hàng?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        const updatedCart = removeFromCart(productId);
        setCartItems(updatedCart);
        setSelectedRowKeys(prev => prev.filter(id => id !== productId));
        message.success('Đã xóa sản phẩm');
      },
    });
  };

  const onSelectionChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const selectedItems = cartItems.filter(item => selectedRowKeys.includes(item.ProductID));

  // 👇 HÀM NÀY CẦN SỬA LẠI ĐỂ GỌI STRIPE
  const handleCheckout = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        message.warning("Vui lòng đăng nhập để thanh toán!");
        navigate("/login");
        return;
    }

    if (selectedItems.length === 0) {
        message.warning("Vui lòng chọn ít nhất 1 sản phẩm để mua!");
        return;
    }

    try {
        setLoading(true);
        // 1. Tạo đơn hàng (Status: Pending)
        const itemsPayload = selectedItems.map(item => ({
            product_id: item.ProductID,
            quantity: item.quantity
        }));

        const orderRes = await createOrder(itemsPayload);
        
        // 2. Nếu tạo đơn thành công -> Gọi API lấy link Stripe
        if (orderRes.order_id) {
            const paymentRes = await createPaymentUrl(orderRes.order_id);
            
            if (paymentRes.checkout_url) {
                // Lưu tạm các ID sản phẩm đã mua vào Session Storage
                // Để tí nữa thanh toán xong quay lại trang Success mới xóa khỏi giỏ
                const itemsToRemove = selectedItems.map(item => item.ProductID);
                sessionStorage.setItem('pending_payment_items', JSON.stringify(itemsToRemove));

                // 🚀 CHUYỂN HƯỚNG SANG STRIPE NGAY LẬP TỨC
                window.location.href = paymentRes.checkout_url; 
            } else {
                message.error("Không lấy được link thanh toán!");
            }
        }

    } catch (error) {
        console.error(error);
        message.error(error.response?.data?.detail || "Đặt hàng thất bại, vui lòng thử lại.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      <Title level={2} style={{ marginBottom: '20px' }}>
        <ShoppingOutlined /> Giỏ hàng của bạn
      </Title>

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
        <Result
            status="404"
            title="Giỏ hàng trống"
            subTitle="Bạn chưa thêm sản phẩm nào vào giỏ hàng."
            extra={<Button type="primary" onClick={() => navigate('/')}>Tiếp tục mua sắm</Button>}
        />
      )}
    </div>
  );
};

export default CartPage;