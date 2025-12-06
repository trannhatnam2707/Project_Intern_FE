import api from "./axios";

// Lấy danh sách đánh giá theo Product ID
export const getReviewsByProduct = async (productId) => {
    const res = await api.get(`/api/reviews/${productId}`);
    return res;
};

// Gửi đánh giá mới
export const createReview = async (productId, rating, comment) => {
    const res = await api.post(`/api/reviews/${productId}`, {
        Rating: rating,
        Comment: comment
    });
    return res;
};