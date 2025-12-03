import { Button } from 'antd'
import React from 'react'
import {logout } from '../../services/auth'

const HomePage = () => {
  return (
    <div>
        <h1>Trang chủ </h1>
        <p>Chào mừng bạn đã đăng nhập thành công!</p>

        <Button type="primary" danger onClick={logout}>
            Đăng xuất ngay
        </Button>
    </div>
  )
}

export default HomePage