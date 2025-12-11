import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Avatar, Dropdown, Space } from 'antd';
import { 
  DashboardOutlined, 
  ShoppingOutlined, 
  OrderedListOutlined, 
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { logout } from '../services/auth'; // Hàm logout chỉ xóa token

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  
  const navigate = useNavigate();
  const location = useLocation();

  // Menu bên trái
  const menuItems = [
    { key: '/admin', icon: <DashboardOutlined />, label: 'Thống kê' },
    { key: '/admin/orders', icon: <OrderedListOutlined />, label: 'Đơn hàng' },
    { key: '/admin/products', icon: <ShoppingOutlined />, label: 'Sản phẩm' },
    // { key: '/admin/users', icon: <UserOutlined />, label: 'Khách hàng' }, // Mở lại khi làm trang User
  ];

  // Xử lý đăng xuất dành riêng cho Admin
  const handleAdminLogout = () => {
    logout(); // Xóa token
    navigate('/admin/login'); // Đá về trang đăng nhập Admin
  };

  const userMenu = (
    <Menu items={[
        { 
          key: '1', 
          label: <span className="text-red-600">Đăng xuất</span>, 
          icon: <LogoutOutlined className="text-red-600" />, 
          onClick: handleAdminLogout 
        }
    ]} />
  );

  return (
    <Layout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light" className="border-r border-gray-200 shadow-sm">
        <div className="h-16 flex items-center justify-center border-b border-gray-100">
          <Link to="/admin" className="no-underline">
             <h1 className={`font-bold text-blue-600 text-xl m-0 transition-all duration-300 ${collapsed ? 'scale-0 hidden' : 'scale-100 block'}`}>
                WeHappi Admin
             </h1>
          </Link>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={(e) => navigate(e.key)}
          className="border-none mt-2"
        />
      </Sider>
      
      <Layout>
        <Header style={{ padding: '0 24px', background: colorBgContainer }} className="flex justify-between items-center shadow-sm z-10">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          
          <div className="flex items-center gap-4">
             <span className="text-gray-500 hidden sm:inline">Xin chào, <b>Admin</b></span>
             <Dropdown overlay={userMenu} placement="bottomRight" arrow>
                <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition">
                    <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                </div>
             </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflowY: 'auto'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;