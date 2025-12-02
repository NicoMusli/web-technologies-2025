import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Home from './pages/visitor/Home';
import Products from './pages/visitor/Products';
import Login from './pages/visitor/Login';
import Register from './pages/visitor/Register';
import Cart from './pages/visitor/Cart';
import Checkout from './pages/visitor/Checkout';
import Contact from './pages/visitor/Contact';
import ProductDetails from './pages/visitor/ProductDetails';
import About from './pages/visitor/About';
import Terms from './pages/visitor/Terms';
import Privacy from './pages/visitor/Privacy';
import FAQ from './pages/visitor/FAQ';
import NotFound from './pages/visitor/NotFound';

import CustomerArea from './pages/client/CustomerArea';
import MyOrders from './pages/client/MyOrders';
import OrderDetails from './pages/client/OrderDetails';
import EditOrder from './pages/client/EditOrder';
import SavedDesigns from './pages/client/SavedDesigns';
import EditProfile from './pages/client/EditProfile';
import CancelOrder from './pages/client/CancelOrder';

import Dashboard from './pages/admin/Dashboard';
import ManageProducts from './pages/admin/ManageProducts';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import ManageOrders from './pages/admin/ManageOrders';
import EditOrderAdmin from './pages/admin/EditOrderAdmin';
import Customers from './pages/admin/Customers';
import CustomerProfile from './pages/admin/CustomerProfile';
import Payments from './pages/admin/Payments';
import OrderChangeRequests from './pages/admin/OrderChangeRequests';
import Settings from './pages/admin/Settings';
import ProtectedRoute from './components/ProtectedRoute';

import CookieConsent from './components/CookieConsent';

function App() {
  return (
    <Router>
      <div className="App">
        <CookieConsent />
        <Routes>
          {/* Visitor Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Client Routes */}
          {/* Client Routes */}
          <Route path="/client/customer-area" element={
            <ProtectedRoute allowedRoles={['CLIENT']}>
              <CustomerArea />
            </ProtectedRoute>
          } />
          <Route path="/client/my-orders" element={
            <ProtectedRoute allowedRoles={['CLIENT']}>
              <MyOrders />
            </ProtectedRoute>
          } />
          <Route path="/client/my-orders/:id" element={
            <ProtectedRoute allowedRoles={['CLIENT']}>
              <OrderDetails />
            </ProtectedRoute>
          } />
          <Route path="/client/my-orders/edit/:id" element={
            <ProtectedRoute allowedRoles={['CLIENT']}>
              <EditOrder />
            </ProtectedRoute>
          } />
          <Route path="/client/my-orders/cancel/:id" element={
            <ProtectedRoute allowedRoles={['CLIENT']}>
              <CancelOrder />
            </ProtectedRoute>
          } />
          <Route path="/client/saved-designs" element={
            <ProtectedRoute allowedRoles={['CLIENT']}>
              <SavedDesigns />
            </ProtectedRoute>
          } />
          <Route path="/client/edit-profile" element={
            <ProtectedRoute allowedRoles={['CLIENT']}>
              <EditProfile />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ManageProducts />
            </ProtectedRoute>
          } />
          <Route path="/admin/products/add" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AddProduct />
            </ProtectedRoute>
          } />
          <Route path="/admin/products/edit/:id" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <EditProduct />
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ManageOrders />
            </ProtectedRoute>
          } />
          <Route path="/admin/orders/edit/:id" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <EditOrderAdmin />
            </ProtectedRoute>
          } />
          <Route path="/admin/customers" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Customers />
            </ProtectedRoute>
          } />
          <Route path="/admin/customers/:id" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <CustomerProfile />
            </ProtectedRoute>
          } />
          <Route path="/admin/payments" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Payments />
            </ProtectedRoute>
          } />
          <Route path="/admin/change-requests" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <OrderChangeRequests />
            </ProtectedRoute>
          } />
          <Route path="/admin/order-requests" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <OrderChangeRequests />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
