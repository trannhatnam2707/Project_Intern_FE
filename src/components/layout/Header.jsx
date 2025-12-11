import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, Badge, Dropdown, Avatar, Space, AutoComplete } from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
  ShopOutlined,
  AppstoreOutlined,
  HistoryOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useNavigate, Link, useLocation } from 'react-router-dom';

import { logout } from '../../services/auth';
import { getAllCategories } from '../../services/category';
import { getCart } from '../../utils/cart';
import { getAllProducts } from '../../services/product';

const { Header } = Layout;

const AppHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const [options, setOptions] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  // Load user + categories + cart
  useEffect(() => {
    const userStr =
      localStorage.getItem("user_info") ||
      sessionStorage.getItem("user_info");

    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {}
    }

    const fetchCategories = async () => {
      const data = await getAllCategories();
      if (data) setCategories(data);
    };
    fetchCategories();

    const updateCartCount = () => {
      const cart = getCart();
      setCartCount(cart.length);
    };
    updateCartCount();
    window.addEventListener("storage", updateCartCount);

    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  // ================================
  // 🔍 SEARCH – FIX UI + LOGIC
  // ================================
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchValue || searchValue.trim() === "") {
        setOptions([]);
        return;
      }

      try {
        const res = await getAllProducts({ search: searchValue, limit: 5 });
        if (res && res.data) {
          const searchOptions = res.data.map((product) => ({
            value: product.ProductName,
            item: product, // ⭐ Cho phép lấy ProductID trong onSelect

            label: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "6px 0",
                  cursor: "pointer",
                }}
              >
                <img
                  src={product.ImageURL}
                  alt={product.ProductName}
                  style={{
                    width: 35,
                    height: 35,
                    objectFit: "contain",
                    borderRadius: 4,
                    border: "1px solid #eee",
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {product.ProductName}
                  </div>

                  <div style={{ fontSize: 11, color: "#ff4d4f" }}>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.Price)}
                  </div>
                </div>
              </div>
            ),
          }));

          setOptions(searchOptions);
        }
      } catch (e) {
        console.error(e);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, navigate]);

  // Submit search bằng Enter hoặc nút
  const onSearchSubmit = () => {
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
      setOptions([]);
    }
  };

  // ================================
  // USER MENU
  // ================================
  const userMenu = {
    items: [
      { key: "profile", label: <Link to="/profile">Hồ sơ cá nhân</Link>, icon: <UserOutlined /> },
      { key: "orders", label: <Link to="/orders">Đơn hàng của tôi</Link>, icon: <HistoryOutlined /> },
      { type: "divider" },
      { key: "logout", label: "Đăng xuất", icon: <LogoutOutlined />, danger: true, onClick: logout },
    ],
  };

  const navItems = [
    { key: "/", label: <Link to="/">Trang chủ</Link>, icon: <ShopOutlined /> },
    {
      key: "products-submenu",
      label: "Danh Mục",
      icon: <AppstoreOutlined />,
      children:
        categories.length > 0
          ? categories.map((cat) => ({
              key: `/products?category=${cat.CategoryID}`,
              label: <Link to={`/products?category=${cat.CategoryID}`}>{cat.CategoryName}</Link>,
            }))
          : [{ key: "loading", label: "Đang tải...", disabled: true }],
    },
  ];

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        background: "#001529",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        padding: "0 24px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
      }}
    >
      {/* LOGO */}
      <div
        className="logo"
        style={{ cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center" }}
        onClick={() => navigate("/")}
      >
        <span style={{ fontSize: "24px", fontWeight: "800", color: "#40a9ff" }}>
          Wehappi<span style={{ color: "#fff" }}>Tech</span>
        </span>
      </div>

      {/* MENU */}
      <div style={{ minWidth: "200px" }}>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={navItems}
          style={{
            background: "transparent",
            borderBottom: "none",
            lineHeight: "64px",
            fontSize: "15px",
            fontWeight: 500,
            minWidth: "300px",
          }}
          disabledOverflow={true}
        />
      </div>

      {/* ==========================
          🔍 SEARCH BAR — FIXED
      ========================== */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 500, minWidth: 400, display: "flex" }}>
          <Space.Compact size="large" style={{ width: "100%" }}>
            <AutoComplete
              style={{ width: "100%" }}
              dropdownStyle={{
                width: 420,
                maxHeight: 300,
                overflowY: "auto",
                padding: "6px 0",
                background: "#fff",
                borderRadius: 6,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
              popupMatchSelectWidth={420}
              options={options}
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Tìm sản phẩm (Ví dụ: iPhone...)"
              onSelect={(value, option) => {
                const productId = option.item.ProductID;

                navigate(`/product/${productId}`);
                setSearchValue("");
                setOptions([]);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearchSubmit();
              }}
            />

            <Button type="primary" icon={<SearchOutlined />} onClick={onSearchSubmit}>
              Tìm kiếm
            </Button>
          </Space.Compact>
        </div>
      </div>

      {/* CART + USER */}
      <Space size={24} style={{ flexShrink: 0 }}>
        <Badge count={cartCount} size="small" offset={[-2, 2]}>
          <Button
            shape="circle"
            size="large"
            icon={<ShoppingCartOutlined style={{ fontSize: 20, color: "#fff" }} />}
            onClick={() => navigate("/cart")}
            style={{ background: "transparent", borderColor: "rgba(255,255,255,0.3)" }}
          />
        </Badge>

        {user ? (
          <Dropdown menu={userMenu} trigger={["click"]} placement="bottomRight" arrow>
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 8px",
                borderRadius: 6,
                transition: "0.3s",
                color: "#fff",
              }}
            >
              <Avatar style={{ backgroundColor: "#40a9ff" }} icon={<UserOutlined />} />
              <span
                style={{
                  fontWeight: 500,
                  maxWidth: 120,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.full_name || user.FullName || "Thành viên"}
              </span>
              <DownOutlined style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }} />
            </div>
          </Dropdown>
        ) : (
          <Button type="primary" onClick={() => navigate("/login")} size="large">
            Đăng nhập
          </Button>
        )}
      </Space>
    </Header>
  );
};

export default AppHeader;
