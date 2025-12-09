import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, message, Modal, Result, Button } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import CartList from '../../components/cart/CartList';
import CartSummary from '../../components/cart/CartSummary';

import { getCart, updateCartQuantity, removeFromCart, clearCart } from '../../utils/cart';
import { createOrder } from '../../services/order';

const { Title } = Typography;

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // State lưu các ID được chọn
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
      content: 'Bạn muốn xóa sản phẩm này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        const updatedCart = removeFromCart(productId);
        setCartItems(updatedCart);
        // Nếu xóa món đang chọn thì bỏ nó khỏi danh sách chọn luôn
        setSelectedRowKeys(prev => prev.filter(id => id !== productId));
        message.success('Đã xóa sản phẩm');
      },
    });
  };

  // Hàm khi người dùng tích vào ô vuông
  const onSelectionChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // Lọc ra các sản phẩm thực sự được chọn để tính tiền
  const selectedItems = cartItems.filter(item => selectedRowKeys.includes(item.ProductID));

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
        const itemsPayload = selectedItems.map(item => ({
            product_id: item.ProductID,
            quantity: item.quantity
        }));

        await createOrder(itemsPayload);
        
        // Sau khi mua xong, chỉ xóa những món đã mua khỏi giỏ
        selectedItems.forEach(item => removeFromCart(item.ProductID));
        
        // Cập nhật lại giỏ hàng trên giao diện (giữ lại món chưa mua)
        setCartItems(prev => prev.filter(item => !selectedRowKeys.includes(item.ProductID)));
        setSelectedRowKeys([]); // Reset chọn
        
        Modal.success({
            title: 'Đặt hàng thành công!',
            content: 'Đơn hàng của bạn đang được xử lý.',
            okText: 'Tiếp tục mua sắm',
            onOk: () => navigate('/'),
        });

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
                // Truyền props để hiện checkbox
                selectedRowKeys={selectedRowKeys}
                onSelectionChange={onSelectionChange}
            />
          </Col>
          <Col xs={24} lg={8}>
            <CartSummary 
                // Truyền danh sách ĐÃ CHỌN sang để tính tiền
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