import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 60000, // 60 seconds
});

// 1. Interceptor Request: Tự động gắn token vào header trước khi gửi
api.interceptors.request.use(
  (config) => {
    // Tìm token ở localStorage TRƯỚC, nếu không có thì tìm sessionStorage
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor Response: Xử lý dữ liệu trả về và lỗi
api.interceptors.response.use(
    (response) => {
        // trả về data trưc tiếp
        return response.data;
    },
    (error) => {
        // Xử lý lôi token hết hạn hoặc không hợp lệ 
        if (error.response && error.response.status === 401) {
            console.log('Phiên đăng nhập hết hạn ! ');
            // Tùy chọn: Xóa token và reload trang để về login
            // localStorage.removeItem("access_token");
            // window.location.href = "/login";
    }
    // Ném lỗi ra để component (trang Login/Register) tự xử lý hiển thị thông báo
    return Promise.reject(error);
    }
)


export default api;

