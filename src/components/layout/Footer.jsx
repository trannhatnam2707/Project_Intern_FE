import { Layout } from 'antd';
import React from 'react'


const {Footer} = Layout;
const AppFooter = () => {
  return (
    <Footer style={{ textAlign: 'center', background: '#001529', color: '#fff', padding: '24px' }}>
      WehappiTech ©2025 Created by Tran Nhat Nam
      <br />
      <span style={{ fontSize: '12px', color: '#ffffffaa' }}>
        Đồ án thực tập tốt nghiệp - Đại học Sư Phạm Đà Nẵng
      </span>
    </Footer>
  );
};

export default AppFooter;