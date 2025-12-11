import React from 'react';
import { Table, Tag, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const OrderTable = ({ orders, loading, pagination, onTableChange, onViewDetail }) => {
  
  const columns = [
    { 
      title: 'Mã đơn', 
      dataIndex: 'OrderID', 
      key: 'id', 
      render: (text) => <b>#{text}</b> 
    },
    { 
      title: 'Ngày đặt', 
      dataIndex: 'OrderDate', 
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString('vi-VN')
    },
    { 
      title: 'Tổng tiền', 
      dataIndex: 'TotalAmount', 
      key: 'total',
      render: (val) => <span className="text-blue-600 font-bold">{new Intl.NumberFormat('vi-VN').format(val)} ₫</span>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'Status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        // Map màu theo status trong DB của bạn
        if (status === 'Pending') color = 'orange';
        if (status === 'Paid') color = 'green'; 
        if (status === 'Canceled') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button 
            type="primary" ghost 
            icon={<EyeOutlined />} 
            onClick={() => onViewDetail(record)}
        >
            Chi tiết
        </Button>
      )
    }
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={orders} 
      rowKey="OrderID" 
      loading={loading}
      pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: false
      }}
      onChange={onTableChange}
      bordered
    />
  );
};

export default OrderTable;