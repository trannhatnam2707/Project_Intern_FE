import React from 'react';
import { Modal, Descriptions, Tag, Button, Space } from 'antd';

const OrderDetailModal = ({ open, order, onClose, onUpdateStatus }) => {
  if (!order) return null;

  return (
    <Modal
      title={`Chi tiết đơn hàng #${order.OrderID}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <div className="space-y-4">
        {/* Thông tin chung */}
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Mã đơn hàng">#{order.OrderID}</Descriptions.Item>
          <Descriptions.Item label="Ngày đặt">{new Date(order.OrderDate).toLocaleString('vi-VN')}</Descriptions.Item>
          <Descriptions.Item label="Tổng tiền">
            <span className="text-lg text-red-600 font-bold">
              {new Intl.NumberFormat('vi-VN').format(order.TotalAmount)} ₫
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái hiện tại">
            <Tag color="geekblue">{order.Status}</Tag>
          </Descriptions.Item>
        </Descriptions>

        {/* Khu vực nút bấm xử lý (Dựa trên DB của bạn: Pending / Paid / Canceled) */}
        <div className="border-t pt-4 bg-gray-50 p-4 rounded-md">
          <h4 className="font-bold mb-3 text-gray-700">Cập nhật trạng thái:</h4>
          <Space wrap>
            {order.Status === 'Pending' && (
              <>
                <Button type="primary" onClick={() => onUpdateStatus(order.OrderID, 'Paid')}>
                  Đã thanh toán (Paid)
                </Button>
                <Button danger onClick={() => onUpdateStatus(order.OrderID, 'Canceled')}>
                  Hủy đơn (Canceled)
                </Button>
              </>
            )}

            {(order.Status === 'Paid' || order.Status === 'Canceled') && (
              <span className="text-gray-500 italic">Đơn hàng đã hoàn tất quy trình.</span>
            )}
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;