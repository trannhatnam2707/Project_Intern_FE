import api from "./axios.js";

// Giữ nguyên, chỉ cần nhớ tham số params sẽ có thêm page, limit
export const getAllProducts = async (params = {}) => {
    const res = await api.get("/api/products/", { params });
    return res;
}

// Get product by ID
export const getProductById = async (id) => {
    const res = await api.get(`/api/products/${id}/`);
    return res;
}