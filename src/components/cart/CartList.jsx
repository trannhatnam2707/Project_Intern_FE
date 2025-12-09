import React from 'react';
import { Table, Button, InputNumber, Image, Typography, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/format';

const { Text } = Typography;

const CartList = ({ cartItems, onQuantityChange, onRemove, selectedRowKeys, onSelectionChange }) => {
  
  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Image 
            src={record.ImageURL || "https://via.placeholder.com/100"} 
            width={80} 
            height={80} 
            style={{ objectFit: 'contain', border: '1px solid #f0f0f0', borderRadius: '8px' ,
            backgroundColor: '#fff',
            padding: '4px'   
            }} 
          />
          <div>
            <Link to={`/product/${record.ProductID}`}>
                <Text strong style={{ fontSize: '15px', color: '#262626' }}>{record.ProductName}</Text>
            </Link>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                Kho: {record.Stock}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'Price',
      key: 'price',
      render: (price) => <Text strong>{formatPrice(price)}</Text>,
      width: 150,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty, record) => (
        <InputNumber 
          min={1} 
          max={record} 
          value={qty} 
          onChange={(val) => onQuantityChange(record.ProductID, val)} 
        />
      ),
      width: 120,
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (_, record) => (
        <Text type="danger" strong>
            {formatPrice(record.Price * record.quantity)}
        </Text>
      ),
      width: 150,
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Tooltip title="Xóa khỏi giỏ">
            <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => onRemove(record.ProductID)} 
            />
        </Tooltip>
      ),
      width: 50,
    },
  ];

  // Cấu hình cho Checkbox chọn dòng
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectionChange,
  };

  return (
    <Table 
      rowSelection={rowSelection} // hiện Checkbox
      columns={columns} 
      dataSource={cartItems} 
      rowKey="ProductID" 
      pagination={false} 
      locale={{ emptyText: 'Giỏ hàng trống' }}
    />
  );
};

export default CartList;