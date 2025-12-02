import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LogoutModal from './LogoutModal';

const Navbar = ({ userType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { getCartCount } = useCart();
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
    setIsOpen(false);
    setIsProfileOpen(false);
  };

  const handleConfirmLogout = () => {
    logout(() => {
      navigate('/login');
      setIsLogoutModalOpen(false);
    });
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children, onClick }) => (
    <li>
      <Link
        to={to}
        className={`relative block px-3 py-2 text-sm font-semibold transition-colors duration-300 group ${isActive(to)
          ? 'text-blue-600'
          : 'text-gray-600 hover:text-blue-600'
          }`}
        onClick={onClick}
      >
        {children}
        <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ease-out ${isActive(to) ? 'w-full' : 'w-0 group-hover:w-full'
          }`}></span>
      </Link>
    </li>
  );

  const MobileNavLink = ({ to, children, onClick }) => (
    <li>
      <Link
        to={to}
        className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${isActive(to)
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
          }`}
        onClick={onClick}
      >
        {children}
      </Link>
    </li>
  );

  const AdminLinks = () => (
    <>
      <NavLink to="/admin/dashboard">Dashboard</NavLink>
      <NavLink to="/admin/products">Products</NavLink>
      <NavLink to="/admin/orders">Orders</NavLink>
      <NavLink to="/admin/customers">Customers</NavLink>
      <NavLink to="/admin/payments">Payments</NavLink>
      <NavLink to="/admin/order-requests">Requests</NavLink>
    </>
  );

  const ClientLinks = () => (
    <>
      <NavLink to="/">Return Home</NavLink>
      <NavLink to="/client/customer-area">My Area</NavLink>
      <NavLink to="/client/my-orders">My Orders</NavLink>
      <NavLink to="/client/saved-designs">Saved Designs</NavLink>
    </>
  );

  const VisitorLinks = () => (
    <>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/products">Products</NavLink>
      <NavLink to="/about">About Us</NavLink>
      <NavLink to="/contact">Contact</NavLink>
    </>
  );

  const MobileLinks = () => {
    if (userType === 'admin') {
      return (
        <>
          <MobileNavLink to="/admin/dashboard" onClick={() => setIsOpen(false)}>Dashboard</MobileNavLink>
          <MobileNavLink to="/admin/products" onClick={() => setIsOpen(false)}>Products</MobileNavLink>
          <MobileNavLink to="/admin/orders" onClick={() => setIsOpen(false)}>Orders</MobileNavLink>
          <MobileNavLink to="/admin/customers" onClick={() => setIsOpen(false)}>Customers</MobileNavLink>
          <MobileNavLink to="/admin/payments" onClick={() => setIsOpen(false)}>Payments</MobileNavLink>
          <MobileNavLink to="/admin/order-requests" onClick={() => setIsOpen(false)}>Requests</MobileNavLink>
        </>
      );
    } else if (userType === 'client') {
      return (
        <>
          <MobileNavLink to="/" onClick={() => setIsOpen(false)}>Return Home</MobileNavLink>
          <MobileNavLink to="/client/customer-area" onClick={() => setIsOpen(false)}>My Area</MobileNavLink>
          <MobileNavLink to="/client/my-orders" onClick={() => setIsOpen(false)}>My Orders</MobileNavLink>
          <MobileNavLink to="/client/saved-designs" onClick={() => setIsOpen(false)}>Saved Designs</MobileNavLink>
        </>
      );
    } else {
      return (
        <>
          <MobileNavLink to="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
          <MobileNavLink to="/products" onClick={() => setIsOpen(false)}>Products</MobileNavLink>
          <MobileNavLink to="/about" onClick={() => setIsOpen(false)}>About Us</MobileNavLink>
          <MobileNavLink to="/contact" onClick={() => setIsOpen(false)}>Contact</MobileNavLink>
        </>
      );
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
        ? 'bg-white/90 backdrop-blur-xl shadow-md py-2'
        : 'bg-white/80 backdrop-blur-md border-b border-gray-100 py-4'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex-1 flex items-center gap-4">
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 group-hover:opacity-30 transition-opacity rounded-full"></div>
                <img src="/logo_without_background.png" alt="ACSA Print" className="h-12 w-auto relative z-10 transform group-hover:scale-105 transition-transform duration-300" />
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-6">
            {userType === 'admin' && <AdminLinks />}
            {userType === 'client' && <ClientLinks />}
            {userType === 'visitor' && <VisitorLinks />}
          </ul>

          {/* Right Actions */}
          <div className="flex-1 flex items-center justify-end gap-3">
            {userType === 'client' || userType === 'visitor' || userType === 'admin' ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => user ? setIsProfileOpen(!isProfileOpen) : navigate('/login')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${isProfileOpen ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-100' : 'hover:bg-gray-50 text-gray-700 hover:text-blue-600'
                      } ${loading ? 'opacity-50 cursor-wait' : ''}`}
                    disabled={loading}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 flex items-center justify-center border border-blue-100">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <span className="text-sm font-semibold hidden lg:block">
                      {loading ? '...' : (!user ? 'Login' : (userType === 'admin' ? 'Admin' : (user.username || user.firstName || 'Account')))}
                    </span>
                    {user && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}>
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    )}
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && user && (
                    <div className="absolute right-0 mt-4 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-4 z-50 overflow-hidden ring-1 ring-black/5">
                      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900">{userType === 'admin' ? 'Administrator' : (user.username || user.firstName)}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          to={user.role === 'ADMIN' ? '/admin/dashboard' : '/client/customer-area'}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                          </svg>
                          {user.role === 'ADMIN' ? 'Dashboard' : 'My Area'}
                        </Link>
                        <button
                          onClick={handleLogoutClick}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left mt-1"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                          </svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {userType !== 'admin' && (
                  <Link
                    to="/cart"
                    className="relative p-2.5 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 group"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transform group-hover:scale-110 transition-transform">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    {cartCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm transform scale-100 animate-bounce-subtle">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}
              </>
            ) : (
              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'}`}>
        <ul className="px-4 py-6 space-y-2">
          <MobileLinks />
          {/* Mobile Profile Actions */}
          {user && (userType === 'client' || userType === 'visitor' || userType === 'admin') && (
            <>
              <li className="border-t border-gray-100 my-4 pt-4"></li>
              <li>
                <Link
                  to={user.role === 'ADMIN' ? '/admin/dashboard' : '/client/customer-area'}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  {user.role === 'ADMIN' ? 'Dashboard' : 'My Area'}
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout
                </button>
              </li>
            </>
          )}
          {!user && (userType === 'client' || userType === 'visitor') && (
            <li>
              <Link
                to="/login"
                className="block w-full text-center py-3 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm mt-4"
                onClick={() => setIsOpen(false)}
              >
                Login / Register
              </Link>
            </li>
          )}
        </ul>
      </div>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </nav >
  );
};

export default Navbar;
