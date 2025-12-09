import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const PaymentCancelPage = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="warning"
      title="Thanh toán bị hủy"
      subTitle="Bạn đã hủy quá trình thanh toán. Đơn hàng vẫn được lưu ở trạng thái Chờ (Pending)."
      extra={
        <Button type="primary" onClick={() => navigate('/cart')}>
          Quay lại giỏ hàng
        </Button>
      }
    />
  );
};

export default PaymentCancelPage;