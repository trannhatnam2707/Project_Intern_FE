
// Ghi nhớ đăng nhập (Remember Me), nguyên lý:
// Nếu tích: Lưu Token vào localStorage (Tắt trình duyệt vẫn còn).
// Không tích: Lưu Token vào sessionStorage (Tắt trình duyệt là mất).

import api from "./axios";

export const register = async (fullName, email, password) => {
    const res = await api.post ("/api/users/register/", {
        FullName: fullName,
        Email: email,
        Password: password,
    })
    return res;
}

// 2. Đăng nhập (Thêm tham số remember)
export const login = async (email, password, remember = false) => {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    const res = await api.post("/api/users/auth/login", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    // Quyết định nơi lưu: remember ? localStorage : sessionStorage
    const storage = remember ? localStorage : sessionStorage;

    if (res.access_token) {
        storage.setItem("access_token", res.access_token);
        
        if (res.refresh_token) {
            storage.setItem("refresh_token", res.refresh_token);
        }
        if (res.user) {
            storage.setItem("user_info", JSON.stringify(res.user));
        }
    }
    return res;
};

// Lấy thống tin User hiện tại
export const getMe = async () =>{
    const res = await api.get("/api/users/me")
    return res
}

// cập nhật profile
export const updateProfile = async (data) => {
    const res = await api.put("/api/users/profile/", data)
    return res
}

// Đổi mật khẩu
export const changePassword = async(oldPassword, newPassword) => {
    const res = await api.put("/api/users/change-password/", {
        OldPassword:oldPassword,
        NewPassword:newPassword,
    })
    return res;
};

//Quên mật khẩu (Gửi email)
export const forgotPassword = async(email) => {
    const res = await api.post("/api/users/forgot-password/", null, {
        params:{email}
    })
    return res;
}

// Đặt lại mật khẩu
export const confirmResetPassword = async (token, newPassword) => {
    // Gọi API Backend: POST /api/users/reset-password
    const res = await api.post("/api/users/reset-password/", {
        token: token,
        new_password: newPassword
    });
    return res;
};

//logout
export const logout = () => {
    // Xóa LocalStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_info");
    
    // Xóa SessionStorage
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem("user_info");

    window.location.href = "/login"
};