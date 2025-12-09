import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, message, Modal, Result, Button } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

// Import Components Cart
import CartList from '../../components/cart/CartList';
import CartSummary from '../../components/cart/CartSummary';

// Import Utils & Services
import { getCart, updateCartQuantity, removeFromCart, clearCart } from '../../utils/cart';
import { createOrder } from '../../services/order';

const { Title } = Typography;

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // State lưu danh sách ID sản phẩm được tick chọn
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load giỏ hàng từ LocalStorage
  useEffect(() => {
    setCartItems(getCart());
  }, []);

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (productId, newQuantity) => {
    const updatedCart = updateCartQuantity(productId, newQuantity);
    setCartItems(updatedCart);
  };

  // Xử lý xóa sản phẩm
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
        // Xóa luôn khỏi danh sách đang chọn (nếu có)
        setSelectedRowKeys(prev => prev.filter(id => id !== productId));
        message.success('Đã xóa sản phẩm');
      },
    });
  };

  // Hàm khi người dùng tích vào checkbox
  const onSelectionChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // Lọc ra các sản phẩm ĐƯỢC CHỌN để truyền sang CartSummary tính tiền
  const selectedItems = cartItems.filter(item => selectedRowKeys.includes(item.ProductID));

  // Xử lý Thanh toán
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
        // Chuẩn bị dữ liệu gửi lên API (chỉ gửi những món đã chọn)
        const itemsPayload = selectedItems.map(item => ({
            product_id: item.ProductID,
            quantity: item.quantity
        }));

        // Gọi API tạo đơn hàng
        await createOrder(itemsPayload);
        
        // Thành công: Chỉ xóa những món ĐÃ MUA khỏi giỏ hàng
        selectedItems.forEach(item => removeFromCart(item.ProductID));
        
        // Cập nhật lại giao diện (giữ lại các món chưa mua)
        setCartItems(prev => prev.filter(item => !selectedRowKeys.includes(item.ProductID)));
        setSelectedRowKeys([]); // Reset lựa chọn
        
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
          {/* Cột trái: Danh sách sản phẩm (Có checkbox) */}
          <Col xs={24} lg={16}>
            <CartList 
                cartItems={cartItems} 
                onQuantityChange={handleQuantityChange} 
                onRemove={handleRemove}
                // Truyền props cho checkbox
                selectedRowKeys={selectedRowKeys}
                onSelectionChange={onSelectionChange}
            />
          </Col>
          
          {/* Cột phải: Tổng tiền (Chỉ tính những món đã chọn) */}
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