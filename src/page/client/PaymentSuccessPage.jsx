import React, { useEffect, useState } from 'react';
import { Result, Button, Spin } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmPayment } from '../../services/payment';
import { removeFromCart } from '../../utils/cart';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId) return;
      try {
        // 1. Gọi API cập nhật trạng thái đơn hàng thành "Paid"
        await confirmPayment(orderId);

        // 2. Xóa các sản phẩm đã mua khỏi giỏ hàng
        const pendingItems = sessionStorage.getItem('pending_payment_items');
        if (pendingItems) {
            const itemIds = JSON.parse(pendingItems);
            itemIds.forEach(id => removeFromCart(id));
            sessionStorage.removeItem('pending_payment_items'); // Xóa cache
        }

      } catch (error) {
        console.error("Lỗi cập nhật đơn hàng", error);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [orderId]);

  if (loading) return <div style={{textAlign: 'center', marginTop: 100}}><Spin size="large" tip="Đang xử lý đơn hàng..." /></div>;

  return (
    <Result
      status="success"
      title="Thanh toán thành công!"
      subTitle={`Mã đơn hàng: #${orderId}. Cảm ơn bạn đã mua sắm tại WehappiTech.`}
      extra={[
        <Button type="primary" key="home" onClick={() => navigate('/')}>
          Về trang chủ
        </Button>,
        <Button key="orders" onClick={() => navigate('/orders')}>
          Xem đơn hàng
        </Button>,
      ]}
    />
  );
};

export default PaymentSuccessPage;