import React from 'react';
import { Card, Typography, Divider, Button, Space } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { formatPrice } from '../../utils/format';

const { Title, Text } = Typography;

const CartSummary = ({ selectedItems, onCheckout, loading }) => {
  // Chỉ tính tiền những món có trong danh sách được chọn
  const totalAmount = selectedItems.reduce((acc, item) => acc + item.Price * item.quantity, 0);
  const totalCount = selectedItems.length;

  return (
    <Card 
        title={<Title level={4} style={{ margin: 0 }}>Thanh toán</Title>} 
        style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <Text>Đã chọn:</Text>
        <Text strong>{totalCount} sản phẩm</Text>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <Text>Tạm tính:</Text>
        <Text strong>{formatPrice(totalAmount)}</Text>
      </div>
      
      <Divider style={{ margin: '15px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Text strong style={{ fontSize: '16px' }}>Tổng cộng:</Text>
        <Text type="danger" strong style={{ fontSize: '20px' }}>{formatPrice(totalAmount)}</Text>
      </div>

      <Button 
        type="primary" 
        size="large" 
        block 
        icon={<ArrowRightOutlined />} 
        style={{ height: '45px', fontSize: '16px', borderRadius: '8px' }}
        onClick={onCheckout}
        loading={loading}
        disabled={totalCount === 0} // Không chọn gì thì không cho bấm
      >
        Mua hàng ({totalCount})
      </Button>

      <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '13px', color: '#888' }}>
        <Space direction="vertical" size={2}>
            <span>Chấp nhận thanh toán:</span>
            <span>💳 Chuyển khoản / 💵 Tiền mặt</span>
        </Space>
      </div>
    </Card>
  );
};

export default CartSummary;