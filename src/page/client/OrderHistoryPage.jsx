import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, message, Modal, Tooltip } from 'antd';
import { EyeOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axios from '../../services/axios'; // Import instance axios

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách đơn hàng của tôi
  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/orders/my');
      // Sắp xếp đơn mới nhất lên đầu
      const sortedOrders = res.sort((a, b) => new Date(b.OrderDate) - new Date(a.OrderDate));
      setOrders(sortedOrders);
    } catch (error) {
      message.error("Lỗi tải lịch sử đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  // Xử lý Hủy đơn
  const handleCancelOrder = (orderId) => {
    Modal.confirm({
        title: 'Xác nhận hủy đơn hàng',
        content: 'Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.',
        okText: 'Đồng ý hủy',
        okType: 'danger',
        cancelText: 'Thoát',
        onOk: async () => {
            try {
                await axios.put(`/api/orders/${orderId}/cancel`);
                message.success("Đã hủy đơn hàng thành công!");
                fetchMyOrders(); // Tải lại danh sách
            } catch (error) {
                message.error(error.response?.data?.detail || "Lỗi khi hủy đơn");
            }
        }
    });
  };

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'OrderID',
      key: 'id',
      render: (text) => <b>#{text}</b>,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'OrderDate',
      key: 'date',
      render: (text) => new Date(text).toLocaleString('vi-VN'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'TotalAmount',
      key: 'total',
      render: (price) => <span style={{color: '#d4380d', fontWeight: 'bold'}}>{new Intl.NumberFormat('vi-VN').format(price)} ₫</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'Status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        let text = status;
        
        switch(status) {
            case 'Pending': color = 'orange'; text = 'Chờ thanh toán'; break;
            case 'Paid': color = 'cyan'; text = 'Đã thanh toán'; break;
            case 'Shipping': color = 'blue'; text = 'Đang giao'; break;
            case 'Completed': color = 'green'; text = 'Hoàn thành'; break;
            case 'Cancelled': color = 'red'; text = 'Đã hủy'; break;
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '10px' }}>
            {/* Nút Hủy chỉ hiện khi đơn là Pending */}
            {record.Status === 'Pending' && (
                <Tooltip title="Hủy đơn hàng">
                    <Button 
                        danger 
                        size="small" 
                        icon={<CloseCircleOutlined />} 
                        onClick={() => handleCancelOrder(record.OrderID)}
                    >
                        Hủy
                    </Button>
                </Tooltip>
            )}
            
            {/* Nút Xem chi tiết (Nếu có trang chi tiết) */}
            {/* <Button size="small" icon={<EyeOutlined />}>Chi tiết</Button> */}
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', minHeight: '400px' }}>
      <h2 style={{ marginBottom: '20px', color: '#001529' }}>Lịch sử đơn hàng</h2>
      <Table 
        columns={columns} 
        dataSource={orders} 
        rowKey="OrderID" 
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default OrderHistoryPage;