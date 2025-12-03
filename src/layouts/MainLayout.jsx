import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div style={{minHeight: "100vh", display:"flex", flexDirection:"column"}}>
        {/* Header sẽ thêm sau */}
        <main style={{flex:1, padding:"20px", background:'#f0f2f5' }}>
            {/* đây là nơi hiển thị HomePage, ProductPage,.... */}
            <Outlet/>
        </main>
        {/* Footer sẽ thêm sau */}
    </div>
  )
}

export default MainLayout