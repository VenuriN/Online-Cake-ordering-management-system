import React from 'react'
import {Route, Routes} from 'react-router-dom'

import Login from '../pages/Login'
import Home from '../pages/Home'
import About from '../pages/About'
import Register from '../pages/Register'
import Contact from '../pages/Contact'
import Dashboard from '../pages/admin/Dashboard'
import UserDashboard from '../pages/User/Dashboard'
import CustomOrder from '../pages/CustomOrder/CustomOrderPage'
import OrderTracking from '../pages/User/Trackorder'
import Orders from '../pages/User/Orders';
import AdminCustomOrders from '../pages/admin/CustomOrders'

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/about-us" element={<About/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/admin/dashboard" element={<Dashboard/>}/>
        <Route path="/user/dashboard" element={<UserDashboard/>}/>
        <Route path="/custom-orders" element={<CustomOrder/>}/>
        <Route path="/order-tracking/:orderId" element={<OrderTracking/>}/>
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin/orders" element={<AdminCustomOrders />} />
    </Routes>
  )
}

export default AppRoutes