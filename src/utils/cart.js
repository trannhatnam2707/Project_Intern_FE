export const getCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product, quantity) => {
  const cart = getCart();
  const existingItemIndex = cart.findIndex((item) => item.ProductID === product.ProductID);

  if (existingItemIndex > -1) {
    // Nếu có rồi thì cộng dồn số lượng
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Nếu chưa có thì thêm mới
    cart.push({ ...product, quantity });
  }
  
  localStorage.setItem("cart", JSON.stringify(cart));
  // Bắn event để Header (nếu có badge số lượng) tự cập nhật
  window.dispatchEvent(new Event("storage")); 
};

// Cập nhật số lượng
export const updateCartQuantity = (productId, newQuantity) => {
  const cart = getCart();
  const itemIndex = cart.findIndex((item) => item.ProductID === productId);
  if (itemIndex > -1) {
    cart[itemIndex].quantity = newQuantity;
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
  }
  return cart;
};

// Xóa sản phẩm
export const removeFromCart = (productId) => {
  const cart = getCart().filter((item) => item.ProductID !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("storage"));
  return cart;
};

// Xóa sạch giỏ (sau khi thanh toán)
export const clearCart = () => {
  localStorage.removeItem("cart");
  window.dispatchEvent(new Event("storage"));
};