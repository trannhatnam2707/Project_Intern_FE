import React, { useEffect, useState } from 'react';
import { Table, Tag, Typography, Button, Space, Card, Modal, Descriptions, message, Spin } from 'antd';
import { EyeOutlined, ShoppingOutlined, CreditCardOutlined } from '@ant-design/icons';
import { getMyOrders } from '../../services/order';
// 👇 Import thêm service tạo link thanh toán
import { createPaymentUrl } from '../../services/payment'; 
import { formatPrice } from '../../utils/format';

const { Title, Text } = Typography;

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false); // State loading khi bấm thanh toán
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error("Lỗi tải đơn hàng", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // 👇 Hàm xử lý thanh toán lại
  const handleRepay = async (orderId) => {
    try {
        setPaying(true);
        message.loading("Đang kết nối cổng thanh toán...", 1);
        
        // Gọi lại API tạo link Stripe cho đơn hàng cũ
        const res = await createPaymentUrl(orderId);
        
        if (res.checkout_url) {
            // Chuyển hướng sang Stripe
            window.location.href = res.checkout_url;
        } else {
            message.error("Không tạo được link thanh toán.");
        }
    } catch (error) {
        message.error("Lỗi kết nối thanh toán: " + (error.response?.data?.detail || "Vui lòng thử lại"));
    } finally {
        setPaying(false);
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'Pending': return <Tag color="orange">Chờ thanh toán</Tag>;
      case 'Paid': return <Tag color="green">Đã thanh toán</Tag>;
      case 'Shipping': return <Tag color="blue">Đang giao</Tag>;
      case 'Completed': return <Tag color="cyan">Hoàn tất</Tag>;
      case 'Cancelled': return <Tag color="red">Đã hủy</Tag>;
      default: return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    { title: 'Mã đơn', dataIndex: 'OrderID', key: 'id', render: (text) => <b>#{text}</b> },
    { title: 'Ngày đặt', dataIndex: 'OrderDate', key: 'date', render: (date) => new Date(date).toLocaleString('vi-VN') },
    { title: 'Tổng tiền', dataIndex: 'TotalAmount', key: 'total', render: (price) => <Text type="danger" strong>{formatPrice(price)}</Text> },
    { title: 'Trạng thái', dataIndex: 'Status', key: 'status', render: (status) => getStatusTag(status) },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
            {/* Nút Chi tiết */}
            <Button 
                type="text" 
                icon={<EyeOutlined />} 
                onClick={() => {
                    setSelectedOrder(record);
                    setIsModalOpen(true);
                }}
            >
                Chi tiết
            </Button>

            {/* 👇 CHỈ HIỆN NÚT THANH TOÁN NẾU LÀ PENDING */}
            {record.Status === 'Pending' && (
                <Button 
                    type="primary" 
                    size="small"
                    icon={<CreditCardOutlined />} 
                    loading={paying}
                    onClick={() => handleRepay(record.OrderID)}
                >
                    Thanh toán
                </Button>
            )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '40px 0', maxWidth: '1000px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: 20 }}><ShoppingOutlined /> Lịch sử đơn hàng</Title>
      
      <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Table 
            columns={columns} 
            dataSource={orders} 
            rowKey="OrderID" 
            loading={loading}
            pagination={{ pageSize: 5 }}
            locale={{ emptyText: 'Bạn chưa có đơn hàng nào' }}
        />
      </Card>

      <Modal 
        title={`Chi tiết đơn hàng #${selectedOrder?.OrderID}`} 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)}
        footer={[
            <Button key="close" onClick={() => setIsModalOpen(false)}>Đóng</Button>,
            // Cũng có thể thêm nút thanh toán trong Modal chi tiết luôn
            selectedOrder?.Status === 'Pending' && (
                <Button key="pay" type="primary" onClick={() => handleRepay(selectedOrder.OrderID)}>
                    Thanh toán ngay
                </Button>
            )
        ]}
        width={600}
      >
        {selectedOrder && (
            <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Ngày đặt">{new Date(selectedOrder.OrderDate).toLocaleString('vi-VN')}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">{getStatusTag(selectedOrder.Status)}</Descriptions.Item>
                <Descriptions.Item label="Tổng tiền">{formatPrice(selectedOrder.TotalAmount)}</Descriptions.Item>
            </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistoryPage;