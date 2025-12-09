import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 60000, 
});

// 1. Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor (Đã nâng cấp)
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401 và chưa từng thử refresh (biến _retry đánh dấu)
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Đánh dấu đã thử refresh để tránh vòng lặp vô tận

            try {
                // Lấy refresh token từ storage
                const refreshToken = localStorage.getItem("refresh_token") || sessionStorage.getItem("refresh_token");

                if (!refreshToken) {
                    throw new Error("Không có refresh token");
                }

                // 👇 GỌI API REFRESH TOKEN (Check lại đường dẫn backend của bạn nhé)
                // Giả sử Backend nhận refresh_token qua body hoặc query param
                // Nếu Backend bạn yêu cầu gửi dạng: post("/api/users/refresh", { refresh_token: ... })
                const res = await axios.post(`${api.defaults.baseURL}/api/users/refresh`, null, {
                    params: { refresh_token: refreshToken } 
                });

                // Nếu lấy được token mới
                if (res.data.access_token) {
                    // 1. Lưu token mới vào storage
                    const storage = localStorage.getItem("refresh_token") ? localStorage : sessionStorage;
                    storage.setItem("access_token", res.data.access_token);

                    // 2. Gắn token mới vào header của request cũ
                    originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;

                    // 3. Thực hiện lại request cũ
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.log("Phiên đăng nhập hết hạn hẳn, cần đăng nhập lại.");
                // Xóa sạch token rác
                localStorage.clear();
                sessionStorage.clear();
                // Chuyển về trang login
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;