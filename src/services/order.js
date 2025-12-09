import api from "./axios";

// Tạo đơn hàng mới
export const createOrder = async (items) => {
    // items format gửi lên BE: [{product_id: 1, quantity: 2}, ...]
    const res = await api.post("/api/orders/", {
        items: items
    });
    return res;
};

export const getMyOrders = async () => {
    const res = await api.get("/api/orders/my");
    return res;
};