import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ajaxRequest } from '../../utils/ajax';
import Select from '../../components/Select';
import DateInput from '../../components/DateInput';
import Toast from '../../components/Toast';

const ManageOrders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [changeRequests, setChangeRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.toast) {
      setToast(location.state.toast);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    ajaxRequest('GET', '/api/orders', null, (error, data) => {
      if (!error) {
        const mappedOrders = data.map(o => ({
          id: o.id,
          client: `${o.user.firstName} ${o.user.lastName}`,
          date: new Date(o.createdAt).toLocaleDateString(),
          rawDate: o.createdAt,
          status: o.status,
          total: `€${o.total.toFixed(2)}`
        }));
        setAllOrders(mappedOrders);
      }

      ajaxRequest('GET', '/api/order-change-requests', null, (reqError, reqData) => {
        if (!reqError) {
          setChangeRequests(reqData);
        }
        setLoading(false);
      });
    });
  }, []);

  const [sortOrder, setSortOrder] = useState('newest');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filters = ['All', 'PENDING', 'COMPLETED', 'CANCELLED'];

  const filteredOrders = allOrders.filter(order => {
    const matchesFilter = activeFilter === 'All' || order.status.toUpperCase() === activeFilter.toUpperCase();
    const matchesSearch = order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesDate = true;
    if (startDate) {
      const orderDate = new Date(order.rawDate);
      matchesDate = matchesDate && orderDate >= new Date(startDate);
    }
    if (endDate) {
      const orderDate = new Date(order.rawDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchesDate = matchesDate && orderDate <= end;
    }

    return matchesFilter && matchesSearch && matchesDate;
  }).sort((a, b) => {
    const dateA = new Date(a.rawDate);
    const dateB = new Date(b.rawDate);
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const hasPendingRequest = (orderId) => {
    return changeRequests.some(req => req.orderId === orderId && req.status === 'PENDING');
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
      case 'PENDING': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusDot = (status) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED': return 'bg-green-500';
      case 'CANCELLED': return 'bg-red-500';
      case 'PENDING': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar userType="admin" />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
          <p className="text-gray-500 mt-1">View, process and track customer orders.</p>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">

        {/* Filters & Controls */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => { setActiveFilter(filter); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeFilter === filter
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="w-full md:w-48">
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                options={[
                  { value: "newest", label: "Newest First" },
                  { value: "oldest", label: "Oldest First" }
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-4 border-t border-gray-100">
            {/* Search */}
            <div className="md:col-span-6 relative">
              <input
                type="text"
                placeholder="Search by Order ID or Client Name..."
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

            {/* Date Range */}
            <div className="md:col-span-6 flex gap-2 items-center">
              <div className="flex-grow">
                <DateInput
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Start Date"
                  className="w-full"
                />
              </div>
              <span className="text-gray-400 font-medium">-</span>
              <div className="flex-grow">
                <DateInput
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="End Date"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {currentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Total</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-medium text-gray-900">#{order.id}</span>
                        {hasPendingRequest(order.id) && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200">
                              REQUEST PENDING
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                            {order.client.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{order.client}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(order.status)}`}></span>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-gray-900">{order.total}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/admin/orders/edit/${order.id}`}
                          className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm || activeFilter !== 'All'
                  ? 'Try adjusting your filters or search terms.'
                  : 'No orders have been placed yet.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
            >
              Previous
            </button>
            <span className="flex items-center px-4 font-medium text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
            >
              Next
            </button>
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

export default ManageOrders;
