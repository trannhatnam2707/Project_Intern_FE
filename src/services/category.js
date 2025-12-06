import api from "./axios.js";

export const getAllCategories = async () => {
    const res = await api.get("/api/categories/");
    return res;
}

export const getProductById = async (id) => {
    const res = await api.get(`/api/products/${id}`);
    return res;
}