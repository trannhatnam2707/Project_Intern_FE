import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, Badge, Dropdown, Avatar, Space, AutoComplete } from 'antd'; // Bỏ Input thừa
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined, DownOutlined, ShopOutlined, AppstoreOutlined, HistoryOutlined, SearchOutlined } from '@ant-design/icons';
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

  useEffect(() => {
    const userStr = localStorage.getItem("user_info") || sessionStorage.getItem("user_info");
    if (userStr) { try { setUser(JSON.parse(userStr)); } catch (e) {} }

    const fetchCategories = async () => {
      const data = await getAllCategories();
      if (data) setCategories(data);
    };
    fetchCategories();

    const updateCartCount = () => { const cart = getCart(); setCartCount(cart.length); };
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    
    return () => { window.removeEventListener('storage', updateCartCount); };
  }, []);

  // Xử lý tìm kiếm gợi ý
  useEffect(() => {
    const timer = setTimeout(async () => {
        if (!searchValue || searchValue.trim() === "") {
            setOptions([]);
            return;
        }
        try {
            const res = await getAllProducts({ search: searchValue, limit: 5 });
            if (res && res.data) {
                const searchOptions = res.data.map(product => ({
                    value: product.ProductName,
                    label: (
                        <div 
                            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '5px 0' }}
                            onClick={() => {
                                navigate(`/product/${product.ProductID}`);
                                setSearchValue(""); 
                                setOptions([]);
                            }}
                        >
                            <img src={product.ImageURL} alt={product.ProductName} style={{ width: 35, height: 35, objectFit: 'contain', borderRadius: 4, border: '1px solid #f0f0f0' }} />
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.ProductName}</div>
                                <div style={{ fontSize: 11, color: '#ff4d4f' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.Price)}</div>
                            </div>
                        </div>
                    ),
                }));
                setOptions(searchOptions);
            }
        } catch (error) { console.error(error); }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue, navigate]);

  const onSearchSubmit = () => {
    if (searchValue.trim()) {
        navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
        setOptions([]);
    }
  };

  const userMenu = {
    items: [
      { key: 'profile', label: <Link to="/profile">Hồ sơ cá nhân</Link>, icon: <UserOutlined /> },
      { key: 'orders', label: <Link to="/orders">Đơn hàng của tôi</Link>, icon: <HistoryOutlined /> },
      { type: 'divider' },
      { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, danger: true, onClick: logout },
    ]
  };

  const navItems = [
    { key: '/', label: <Link to="/">Trang chủ</Link>, icon: <ShopOutlined /> },
    {
      key: 'products-submenu', label: 'Danh Mục', icon: <AppstoreOutlined />,
      children: categories.length > 0 ? categories.map(cat => ({
        key: `/products?category=${cat.CategoryID}`,
        label: <Link to={`/products?category=${cat.CategoryID}`}>{cat.CategoryName}</Link>
      })) : [{ key: 'loading', label: 'Đang tải...', disabled: true }],
    },
  ];

  return (
    <Header style={{ position: 'sticky', top: 0, zIndex: 1000, width: '100%', background: '#001529', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', gap: '20px' }}>
      <div className="logo" style={{ cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center' }} onClick={() => navigate('/')}>
        <span style={{ fontSize: '24px', fontWeight: '800', color: '#40a9ff', lineHeight: 1 }}>Wehappi<span style={{ color: '#fff' }}>Tech</span></span>
      </div>

      <div style={{ minWidth: '200px' }}>
        <Menu theme="dark" mode="horizontal" selectedKeys={[location.pathname]} items={navItems} style={{ background: 'transparent', borderBottom: 'none', lineHeight: '64px', fontSize: '15px', fontWeight: 500, minWidth: '300px' }} disabledOverflow={true} />
      </div>

      {/* 👇 THANH TÌM KIẾM MỚI - ĐÃ SỬA LỖI UI */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <Space.Compact style={{ width: '100%', maxWidth: '500px' }} size="large">
            <AutoComplete
                style={{ width: '100%' }}
                options={options}
                value={searchValue}
                onChange={setSearchValue}
                onSelect={(val) => setSearchValue(val)}
                backfill
                placeholder="Tìm sản phẩm (Ví dụ: iPhone...)"
                // 👇 Xử lý phím Enter trực tiếp trên AutoComplete
                onKeyDown={(e) => {
                    if (e.key === 'Enter') onSearchSubmit();
                }}
                allowClear
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={onSearchSubmit}>
                Tìm kiếm
            </Button>
        </Space.Compact>
      </div>

      <Space size={24} style={{ flexShrink: 0 }}>
        <Badge count={cartCount} size="small" offset={[-2, 2]}>
          <Button shape="circle" size="large" icon={<ShoppingCartOutlined style={{ fontSize: '20px', color: '#fff' }} />} onClick={() => navigate('/cart')} style={{ background: 'transparent', borderColor: 'rgba(255,255,255,0.3)' }} />
        </Badge>

        {user ? (
          <Dropdown menu={userMenu} placement="bottomRight" arrow trigger={['click']}>
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', borderRadius: '6px', transition: 'all 0.3s', color: '#fff' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <Avatar style={{ backgroundColor: '#40a9ff', verticalAlign: 'middle' }} icon={<UserOutlined />} size="default" />
              <span style={{ fontWeight: 500, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.full_name || user.FullName || "Thành viên"}</span>
              <DownOutlined style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }} />
            </div>
          </Dropdown>
        ) : (
          <Button type="primary" onClick={() => navigate('/login')} size="large">Đăng nhập</Button>
        )}
      </Space>
    </Header>
  );
};

export default AppHeader;