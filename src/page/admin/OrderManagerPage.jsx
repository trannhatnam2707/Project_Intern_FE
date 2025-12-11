import React, { useState, useEffect } from 'react';
import { message, Select, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from '../../services/axios'; 

// Import Component con
import OrderTable from '../../components/admin/OrderTable';
import OrderDetailModal from '../../components/admin/OrderDetailModal';

const { Option } = Select;

const OrderManagerPage = () => {
  // State Data
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  // State Filter
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // Mặc định là 'all' để lấy tất cả

  // State Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // 1. Gọi API
  const fetchOrders = async (page = 1, status = filterStatus, search = searchText) => {
    setLoading(true);
    try {
      const res = await axios.get('/api/orders/', {
        params: {
          page: page,
          limit: pagination.pageSize,
          status: status === 'all' ? undefined : status, // Logic 'all' ở đây
          search: search || undefined
        }
      });
      
      setOrders(res.data.data); 
      setPagination(prev => ({ ...prev, current: page, total: res.data.total }));
    } catch (error) {
      console.error(error);
      message.error('Lỗi tải danh sách');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(1); }, []);

  // 2. Các hàm xử lý sự kiện
  const handleTableChange = (newPagination) => {
    fetchOrders(newPagination.current);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}/${newStatus}`);
      message.success('Cập nhật thành công');
      fetchOrders(pagination.current);
      setIsDetailOpen(false);
    } catch (error) {
      message.error('Lỗi cập nhật');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Quản lý Đơn hàng</h2>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 justify-between bg-white p-4 rounded-lg shadow-sm">
        <Input 
          placeholder="Tìm theo ID..." 
          prefix={<SearchOutlined />} 
          style={{ width: 250 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={() => fetchOrders(1)} 
        />
        <Select 
          defaultValue="all" 
          style={{ width: 200 }} 
          onChange={(value) => {
             setFilterStatus(value);
             fetchOrders(1, value, searchText);
          }}
        >
          <Option value="all">Tất cả trạng thái</Option>
          <Option value="Pending">Chờ thanh toán (Pending)</Option>
          <Option value="Paid">Đã thanh toán (Paid)</Option>
          <Option value="Canceled">Đã hủy (Canceled)</Option>
        </Select>
      </div>

      {/* Gọi Component Bảng */}
      <OrderTable 
        orders={orders}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onViewDetail={(record) => {
           setSelectedOrder(record);
           setIsDetailOpen(true);
        }}
      />

      {/* Gọi Component Modal */}
      <OrderDetailModal 
        open={isDetailOpen}
        order={selectedOrder}
        onClose={() => setIsDetailOpen(false)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default OrderManagerPage;