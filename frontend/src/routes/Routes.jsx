import React from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'

import Login from '../pages/Login'
import Home from '../pages/Home'
import About from '../pages/About'
import Register from '../pages/Register'
import Contact from '../pages/Contact'
import UserDashboard from '../pages/User/Dashboard'
import CustomOrder from '../pages/CustomOrderPage'
import OrderTracking from '../pages/User/Trackorder'
import Orders from '../pages/User/Orders';
import DeliveryLogin from '../pages/delivery/DeliveryLogin';
import DeliveryDashboard from '../pages/delivery/DeliveryDashboard';
import OrderConfirmation from '../pages/OrderConfirmation';
import UserOrdersPage from '../pages/UserOrdersPage';
import OrderDetailsPage from '../pages/OrderDetailsPage';
import MyOrders from '../pages/User/MyOrders'
// Admin Components
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboardPage from '../pages/admin/AdminDashboard';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminOrderDetailsPage from '../pages/admin/AdminOrderDetailsPage';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage';
import AdminAddonsPage from '../pages/admin/AdminAddonsPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import DeliveryPersonsPage from '../pages/admin/DeliveryPersonsPage'
import FinancePage from '../pages/admin/Finance'
import Inventory from '../pages/admin/Inventory'
import ForgotPassword from '../pages/ForgotPassword';
import VerifyOTP from '../pages/VerifyOTP';
import ResetPassword from '../pages/ResetPassword';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminManagement from '../pages/admin/AdminManagement';
const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/about-us" element={<About/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/user/dashboard" element={<UserDashboard/>}/>
        <Route path="/custom-orders" element={<CustomOrder/>}/>
        <Route path="/order-tracking/:orderId" element={<OrderTracking/>}/>
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin/inventory" element={<Inventory />} />
        <Route path="/delivery/login" element={<DeliveryLogin />} />
        <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
        <Route path="/order-confirmation/:orderid" element={<OrderConfirmation />} />
        <Route path="/user/orders" element={<UserOrdersPage />} />
        <Route path="/order/:id" element={<OrderDetailsPage />} />
        <Route path="/user/my-orders" element={<MyOrders />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetailsPage />} />
        <Route path="/admin/categories" element={<AdminCategoriesPage />} />
        <Route path="/admin/addons" element={<AdminAddonsPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/delivery" element={<DeliveryPersonsPage />} />
        <Route path="/admin/finance" element={<FinancePage />} />
        <Route path="/admin/inventory" element={<Inventory />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/admin-management" element={<AdminManagement />} />
    </Routes>
  )
}

export default AppRoutes