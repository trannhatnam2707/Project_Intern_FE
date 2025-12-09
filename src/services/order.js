import api from "./axios";

// Tạo đơn hàng mới
export const createOrder = async (items) => {
    const res = await api.post("/api/orders/", {
        items: items
    });
    return res;
};

// 👇 Bổ sung hàm lấy danh sách đơn hàng
export const getMyOrders = async () => {
    // Lưu ý: Không có dấu / ở cuối
    const res = await api.get("/api/orders/my");
    return res;
};