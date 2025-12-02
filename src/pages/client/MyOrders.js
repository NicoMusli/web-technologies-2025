import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ajaxRequest } from '../../utils/ajax';
import { useAuth } from '../../context/AuthContext';
import Select from '../../components/Select';
import DateInput from '../../components/DateInput';
import Toast from '../../components/Toast';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [toast, setToast] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.toast) {
      setToast(location.state.toast);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (user) {
      ajaxRequest('GET', `/api/orders/user/${user.id}`, null, (error, data) => {
        if (!error) {
          setOrders(data);
        }
        setLoading(false);
      });
    }
  }, [user]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusDot = (status) => {
    switch (status.toLowerCase()) {
      case 'processing': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'shipped': return 'bg-purple-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = order.id.toString().includes(searchTerm) ||
        (order.items && order.items.some(item =>
          item.product && item.product.name && item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
        ));

      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      const matchesDate = filterDate ? orderDate === filterDate : true;

      return matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar userType="client" />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-500 mt-1">Track and manage all your printing orders.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Date Filter */}
              <DateInput
                value={filterDate}
                onChange={(e) => {
                  setFilterDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full md:w-auto"
              />

              {/* Sort Select */}
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                options={[
                  { value: "desc", label: "Newest First" },
                  { value: "asc", label: "Oldest First" }
                ]}
              />

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Search by Order ID or Product..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-gray-50 focus:bg-white"
                />
                <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {currentOrders.length > 0 ? (
          <>
            {/* Desktop View - Grid Cards */}
            <div className="hidden md:block">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {currentOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              {new Date(order.createdAt).toLocaleDateString()} <span className="text-sm font-normal text-gray-500">at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </h3>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                          <span className={`w-2 h-2 rounded-full mr-2 ${getStatusDot(order.status)}`}></span>
                          {order.status}
                        </span>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Product</p>
                            <p className="font-semibold text-gray-900 truncate">
                              {order.items && order.items.length > 0
                                ? order.items.map(i => i.product.name).join(', ')
                                : 'No items'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Quantity</p>
                            <p className="font-semibold text-gray-900">
                              {order.items ? order.items.reduce((acc, i) => acc + i.quantity, 0) : 0}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total</p>
                          <p className="text-2xl font-bold text-gray-900">€{Number(order.total).toFixed(2)}</p>
                        </div>
                        <Link
                          to={`/client/my-orders/${order.id}`}
                          className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
                        >
                          View Details
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile View - Compact Cards */}
            <div className="md:hidden space-y-4">
              {currentOrders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </h3>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)} border`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(order.status)}`}></span>
                      {order.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Product</span>
                      <span className="font-semibold text-gray-900 truncate block max-w-[150px]">
                        {order.items && order.items.length > 0
                          ? order.items.map(i => i.product.name).join(', ')
                          : 'No items'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Qty</span>
                      <span className="font-semibold text-gray-900">
                        {order.items ? order.items.reduce((acc, i) => acc + i.quantity, 0) : 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-gray-500 text-xs uppercase tracking-wider">Total</span>
                      <p className="text-xl font-bold text-gray-900">€{Number(order.total).toFixed(2)}</p>
                    </div>
                    <Link
                      to={`/client/my-orders/${order.id}`}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-3">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md border border-gray-200'}`}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`w-12 h-12 rounded-xl font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 transform scale-110' : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md border border-gray-200'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md border border-gray-200'}`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {searchTerm ? 'No orders found' : 'No orders yet'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              {searchTerm
                ? 'Try adjusting your search terms or clear the search to see all orders.'
                : 'Start your first project today and track it here.'}
            </p>
            {searchTerm ? (
              <button
                onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl"
              >
                Clear Search
              </button>
            ) : (
              <Link
                to="/"
                className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30"
              >
                Browse Services
              </Link>
            )}
          </div>
        )}
      </div>

      <Footer />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default MyOrders;
