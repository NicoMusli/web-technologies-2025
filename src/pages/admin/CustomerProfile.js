import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ajaxRequest } from '../../utils/ajax';

const InfoCard = ({ icon, label, value, iconBg, iconColor }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="flex items-center gap-4 p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
      onClick={() => setIsExpanded(!isExpanded)}
      title={isExpanded ? "Click to collapse" : "Click to expand"}
    >
      <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center ${iconColor} flex-shrink-0 shadow-sm`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
        <span className={`block text-lg font-bold text-gray-900 mt-1 ${isExpanded ? 'break-all whitespace-normal' : 'truncate'}`}>
          {value}
        </span>
      </div>
    </div>
  );
};

const CustomerProfile = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ajaxRequest('GET', `/api/users/${id}`, null, (error, userData) => {
      if (!error) {
        setCustomer({
          profileId: userData.id,
          name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
          username: userData.username || 'N/A',
          email: userData.email
        });
      }

      ajaxRequest('GET', `/api/orders/user/${id}`, null, (error, orderData) => {
        if (!error) {
          const mapped = orderData.map(o => ({
            id: o.id,
            date: new Date(o.createdAt).toLocaleDateString(),
            status: o.status,
            total: `€${o.total.toFixed(2)}`
          }));
          setOrders(mapped);
        }
        setLoading(false);
      });
    });
  }, [id]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredOrders = orders.filter(order =>
    order.id.toString().includes(searchTerm) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Finished': return 'bg-green-100 text-green-700 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Not Started Yet': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'Finished': return 'bg-green-500';
      case 'Cancelled': return 'bg-red-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Not Started Yet': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar userType="admin" />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Customer Profile</h1>
              <p className="text-gray-500 mt-1">View customer details and order history</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        {/* Profile Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
            <p className="text-sm text-gray-500 mt-1">Customer account details</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <InfoCard
                label="Profile ID"
                value={customer.profileId}
                iconBg="bg-blue-100"
                iconColor="text-blue-600"
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                }
              />

              <InfoCard
                label="Name"
                value={customer.name}
                iconBg="bg-purple-100"
                iconColor="text-purple-600"
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                }
              />

              <InfoCard
                label="Username"
                value={customer.username}
                iconBg="bg-indigo-100"
                iconColor="text-indigo-600"
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                }
              />

              <InfoCard
                label="Email"
                value={customer.email}
                iconBg="bg-green-100"
                iconColor="text-green-600"
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                }
              />
            </div>
          </div>
        </div>

        {/* Orders History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order History</h2>
                <p className="text-sm text-gray-500 mt-1">{orders.length} {orders.length === 1 ? 'order' : 'orders'} total</p>
              </div>
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
                />
                <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {currentOrders.length > 0 ? (
            <>
              {/* Desktop & Mobile Unified Card View */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentOrders.map(order => (
                    <div key={order.id} className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Order ID</p>
                          <p className="text-lg font-bold text-blue-600">#{order.id}</p>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                          <span className={`w-2 h-2 rounded-full mr-2 ${getStatusDot(order.status)}`}></span>
                          {order.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Date</p>
                          <p className="font-semibold text-gray-900">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total</p>
                          <p className="text-xl font-bold text-gray-900">{order.total}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-6 border-t border-gray-100 flex justify-center gap-3">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md border border-gray-200'}`}
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-12 h-12 rounded-xl font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 transform scale-110' : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md border border-gray-200'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md border border-gray-200'}`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-24 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">
                {searchTerm
                  ? 'Try adjusting your search terms.'
                  : 'This customer has not placed any orders yet.'}
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CustomerProfile;
