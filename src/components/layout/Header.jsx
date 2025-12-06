import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, Badge, Dropdown, Avatar, Space, Input, message } from 'antd';
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined, DownOutlined, ShopOutlined, AppstoreOutlined, HistoryOutlined } from '@ant-design/icons';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logout } from '../../services/auth';
import { getAllCategories } from '../../services/category';

const { Header } = Layout;
const { Search } = Input;

const AppHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]); 

  // 1. Lấy thông tin User & Danh mục từ API
  useEffect(() => {
    // Lấy User từ Storage
    const userStr = localStorage.getItem("user_info") || sessionStorage.getItem("user_info");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Lỗi parse user info", e);
      }
    }

    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi tải danh mục header:", error);
      }
    };
    fetchCategories();
  }, []);

  const onSearch = (value) => {
    if (value.trim()) {
      message.info(`Đang tìm kiếm: ${value}`);
    }
  };

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

  // 🆕 Cấu hình Menu Items Động
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
      // 👇 Nếu có danh mục từ DB thì map ra, nếu chưa thì để mảng rỗng hoặc loading
      children: categories.length > 0 ? categories.map(cat => ({
        key: `/products?category=${cat.CategoryID}`, // Link theo ID danh mục
        label: <Link to={`/products?category=${cat.CategoryID}`}>{cat.CategoryName}</Link>
      })) : [
        { key: 'loading', label: 'Đang tải...', disabled: true }
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
        background: '#001529',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)', 
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}
    >
      {/* Logo */}
      <div 
        className="logo" 
        style={{ cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center' }} 
        onClick={() => navigate('/')}
      >
        <span style={{ fontSize: '24px', fontWeight: '800', color: '#40a9ff', lineHeight: 1 }}>
          Wehappi<span style={{ color: '#fff' }}>Tech</span>
        </span>
      </div>

      {/* Menu */}
      <div style={{ minWidth: '200px' }}>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={navItems}
          style={{ 
            background: 'transparent',
            borderBottom: 'none',
            lineHeight: '64px',
            fontSize: '15px',
            fontWeight: 500,
            minWidth: '300px'
          }}
          disabledOverflow={true}
        />
      </div>

      {/* Search */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <Search
          placeholder="Tìm kiếm sản phẩm..."
          onSearch={onSearch}
          enterButton
          size="large"
          style={{ maxWidth: '500px', width: '100%' }}
        />
      </div>

      {/* Actions */}
      <Space size={24} style={{ flexShrink: 0 }}>
        <Badge count={2} size="small" offset={[-2, 2]}>
          <Button 
            shape="circle" 
            size="large"
            icon={<ShoppingCartOutlined style={{ fontSize: '20px', color: '#fff' }} />} 
            onClick={() => navigate('/cart')}
            style={{ 
              background: 'transparent',
              borderColor: 'rgba(255,255,255,0.3)'
            }} 
          />
        </Badge>

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
                color: '#fff'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
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