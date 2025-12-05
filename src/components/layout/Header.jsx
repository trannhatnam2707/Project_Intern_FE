import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, Badge, Dropdown, Avatar, Space, Input, message } from 'antd';
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined, DownOutlined, ShopOutlined, AppstoreOutlined, HistoryOutlined } from '@ant-design/icons';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logout } from '../../services/auth';

const { Header } = Layout;
const { Search } = Input;

const AppHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Lấy thông tin user
  useEffect(() => {
    const userStr = localStorage.getItem("user_info") || sessionStorage.getItem("user_info");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Lỗi parse user info", e);
      }
    }
  }, []);

  const onSearch = (value) => {
    if (value.trim()) {
      message.info(`Đang tìm kiếm: ${value}`);
    }
  };

  // Menu Dropdown của User
  const userMenu = {
    items: [
      {
        key: 'profile',
        label: <Link to="/profile">Hồ sơ cá nhân</Link>,
        icon: <UserOutlined />,
      },
      {
        key: 'orders',
        label: <Link to="/orders">Đơn hàng của tôi</Link>,
        icon: <HistoryOutlined />,
      },
      { type: 'divider' },
      {
        key: 'logout',
        label: 'Đăng xuất',
        icon: <LogoutOutlined />,
        danger: true,
        onClick: logout,
      },
    ]
  };

  // Menu chính
  const navItems = [
    { 
      key: '/', 
      label: <Link to="/">Trang chủ</Link>, 
      icon: <ShopOutlined /> 
    },
    {
      key: 'products-submenu',
      label: 'Danh Mục',
      icon: <AppstoreOutlined />,
      children: [
        { key: '/products/laptops', label: <Link to="/products/laptops">Laptop</Link> },
        { key: '/products/phones', label: <Link to="/products/phones">Điện thoại</Link> },
        { key: '/products/watches', label: <Link to="/products/watches">Đồng hồ</Link> },
        { key: '/products/watches', label: <Link to="/products/watches">Đồng hồ</Link> },
        { key: '/products/watches', label: <Link to="/products/watches">Đồng hồ</Link> },

      ],
    },
  ];

  return (
    <Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        // 👇 1. Đổi màu nền sang xanh đen (#001529) cho giống Footer
        background: '#001529',
        // Thêm đường viền mờ bên dưới để tách biệt nếu body cùng màu tối (tùy chọn)
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)', 
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}
    >
      {/* --- KHỐI 1: LOGO --- */}
      <div 
        className="logo" 
        style={{ cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center' }} 
        onClick={() => navigate('/')}
      >
        {/* 👇 2. Chữ "Wehappi" màu xanh sáng hơn (#40a9ff) để dễ nhìn trên nền tối */}
        {/* 👇 3. Chữ "Tech" đổi thành màu Trắng (#fff) */}
        <span style={{ fontSize: '24px', fontWeight: '800', color: '#40a9ff', lineHeight: 1 }}>
          Wehappi<span style={{ color: '#fff' }}>Tech</span>
        </span>
      </div>

      {/* --- KHỐI 2: MENU --- */}
      <div style={{ minWidth: '200px' }}>
        <Menu
          theme="dark" // 👈 4. Quan trọng: Chế độ tối giúp chữ tự động thành màu trắng
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={navItems}
          style={{ 
            background: 'transparent', // Nền trong suốt để ăn theo màu Header
            borderBottom: 'none',
            lineHeight: '64px',
            fontSize: '15px',
            fontWeight: 500,
            minWidth: '300px'
          }}
          disabledOverflow={true}
        />
      </div>

      {/* --- KHỐI 3: SEARCH --- */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <Search
          placeholder="Tìm kiếm sản phẩm..."
          onSearch={onSearch}
          enterButton
          size="large"
          style={{ maxWidth: '500px', width: '100%' }}
          // Search box mặc định màu trắng nên rất nổi trên nền tối, không cần sửa
        />
      </div>

      {/* --- KHỐI 4: ACTIONS --- */}
      <Space size={24} style={{ flexShrink: 0 }}>
        {/* Giỏ hàng */}
        <Badge count={2} size="small" offset={[-2, 2]}>
          <Button 
            shape="circle" 
            size="large"
            // 👇 5. Đổi màu Icon giỏ hàng thành Trắng
            icon={<ShoppingCartOutlined style={{ fontSize: '20px', color: '#fff' }} />} 
            onClick={() => navigate('/cart')}
            style={{ 
              background: 'transparent', // Nền trong suốt
              borderColor: 'rgba(255,255,255,0.3)' // Viền mờ
            }} 
          />
        </Badge>

        {/* User Dropdown */}
        {user ? (
          <Dropdown menu={userMenu} placement="bottomRight" arrow trigger={['click']}>
            <div 
              style={{ 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                padding: '4px 8px',
                borderRadius: '6px',
                transition: 'all 0.3s',
                color: '#fff' // 👇 6. Đổi màu chữ tên User thành Trắng
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} // Hover màu sáng nhẹ
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Avatar style={{ backgroundColor: '#40a9ff', verticalAlign: 'middle' }} icon={<UserOutlined />} size="default" />
              <span style={{ fontWeight: 500, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.full_name || "Thành viên"}
              </span>
              <DownOutlined style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }} />
            </div>
          </Dropdown>
        ) : (
          <Button type="primary" onClick={() => navigate('/login')} size="large">
            Đăng nhập
          </Button>
        )}
      </Space>
    </Header>
  );
};

export default AppHeader;