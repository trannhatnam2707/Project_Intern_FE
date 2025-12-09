import api from "./axios";

export const createPaymentUrl = async (orderId) => {
    const res = await api.post(`/api/payment/create-checkout-session/${orderId}`);
    return res;
};

// Xác nhận thanh toán thành công
export const confirmPayment = async (orderId) => {
    const res = await api.put(`/api/payment/success/${orderId}`);
    return res;
};