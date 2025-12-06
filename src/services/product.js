import api from "./axios.js";

//Get all products
export const getAllProducts = async () => {
    const res = await api.get("/api/products/");
    return res;
}

// Get product by ID
export const getProductById = async (id) => {
    const res = await api.get(`/api/products/${id}/`);
    return res;
}