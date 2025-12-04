import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, Badge, Dropdown, Avatar, Space } from 'antd';
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined, DownOutlined, ShopOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../../services/auth';

const { Header } = Layout;

const AppHeader = () => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null)

    const navItems = [
        {key: "/", label: <Link to = "/">Trang chủ </Link>, icon: <ShopOutlined />},
        {key: "/products", label: <Link to = "/products">Sản phẩm </Link>},
        {key: "/orders", label: <Link to = "/orders">Đơn hàng</Link>},
    ];

    useEffect(() => {
        const userStr = localStorage.getItem("user_info") || sessionStorage.getItem("user_info")
        if(userStr){
            try{
                setUser(JSON.parse(userStr));
            }
            catch(e)
            {
                console.error("Lỗi parse user info", e)
            }
        }
    },[])

        const userMenu = {
        items: [
        {
            key: 'profile',
            label: <Link to="/profile">Hồ sơ cá nhân</Link>,
            icon: <UserOutlined />,
        },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: logout, // Gọi hàm logout từ service
        },
        ]
    };

    return (
        <Header style={{ position: 'sticky',
            top: 0,
            zIndex: 1000,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fff',
            boxShadow: '0 2px 8px #f0f1f2',
            padding: '0 24px' 
            }}
        >

            {/* LOGO */}
            <div className="logo" style={{ marginRight: '40px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#1890ff' }}>
            Wehappi<span style={{ color: '#001529' }}>Tech</span>
            </span>
        </div>

            {/* MENU */}
            <Menu
                mode="horizontal"
                defaultSelectedKeys={['/']}
                items={navItems}
                style={{ flex: 1, borderBottom: 'none', lineHeight: '64px' }}
            />

            {/* ACTIONS (Giỏ hàng + User) */}
            <Space size="middle">
                {/* Nút Giỏ hàng */}
                <Badge count={0} size="small"> {/* Số 0 là giả định, sau này lấy từ state */}
                <Button 
                    shape="circle" 
                    icon={<ShoppingCartOutlined />} 
                    onClick={() => navigate('/cart')}
                />
                </Badge>

                {/* User Info hoặc Nút Login */}
                {user ? (
                <Dropdown menu={userMenu} placement="bottomRight">
                    <Space style={{ cursor: 'pointer', padding: '0 10px' }}>
                    <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                    <span style={{ fontWeight: 500, display: 'inline-block' }}>
                        {user.full_name || user.email || "User"}
                    </span>
                    <DownOutlined style={{ fontSize: '10px' }} />
                    </Space>
                </Dropdown>
                ) : (
                <Button type="primary" onClick={() => navigate('/login')}>
                    Đăng nhập
                </Button>
                )}
            </Space>
        </Header>
    )
}

export default AppHeader
