// src/page/client/OrderHistoryPage.jsx
import React, { useEffect, useState } from 'react';
import { Table, Tag, Typography, Button, Space, Card, Modal, Descriptions } from 'antd';
import { EyeOutlined, ShoppingOutlined } from '@ant-design/icons';
import { getMyOrders } from '../../services/order';
import { formatPrice } from '../../utils/format';

const { Title, Text } = Typography;

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); // Để hiện Modal chi tiết
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

  // Hàm hiển thị màu sắc cho trạng thái đơn hàng
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
        <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => {
                setSelectedOrder(record);
                setIsModalOpen(true);
            }}
        >
            Chi tiết
        </Button>
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

      {/* Modal Chi tiết đơn hàng */}
      <Modal 
        title={`Chi tiết đơn hàng #${selectedOrder?.OrderID}`} 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)}
        footer={[<Button key="close" onClick={() => setIsModalOpen(false)}>Đóng</Button>]}
        width={700}
      >
        {selectedOrder && (
            <>
                <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label="Ngày đặt">{new Date(selectedOrder.OrderDate).toLocaleString('vi-VN')}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">{getStatusTag(selectedOrder.Status)}</Descriptions.Item>
                    <Descriptions.Item label="Tổng tiền">{formatPrice(selectedOrder.TotalAmount)}</Descriptions.Item>
                </Descriptions>
                
                {/* Nếu Backend có trả về chi tiết sản phẩm trong Order thì map ra đây */}
                {/* Hiện tại API getMyOrders của bạn chỉ trả về thông tin chung, 
                    nếu muốn hiện list sản phẩm thì cần update Backend thêm relationship */}
            </>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistoryPage;