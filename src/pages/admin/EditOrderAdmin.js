import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ajaxRequest } from '../../utils/ajax';
import Select from '../../components/Select';

const EditOrderAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('In Progress');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ajaxRequest('GET', `/api/orders/${id}`, null, (err, data) => {
      if (err) {
        setError('Failed to fetch order details');
      } else {
        setOrderDetails({
          orderId: data.id,
          client: data.user ? `${data.user.firstName} ${data.user.lastName}` : 'Unknown Client',
          orderDate: new Date(data.createdAt).toLocaleDateString(),
          email: data.user ? data.user.email : 'N/A',
          shippingAddress: data.shippingAddress || 'N/A',
          paymentId: data.paymentId || 'N/A',
          shippingCost: data.shippingCost || 0,
          taxAmount: data.taxAmount || 0,
          total: data.total
        });
        setStatus(data.status);

        const subtotal = data.total - (data.shippingCost || 0) - (data.taxAmount || 0);
        const taxRate = subtotal > 0 ? (data.taxAmount || 0) / subtotal : 0;

        const mappedProducts = data.items ? data.items.map(item => ({
          id: item.id,
          product: item.product ? item.product.name : 'Unknown Product',
          quantity: item.quantity,
          pricePerUnit: `€${(item.price * (1 + taxRate)).toFixed(2)}`,
          total: `€${(item.quantity * item.price * (1 + taxRate)).toFixed(2)}`,
          customization: item.customization ? JSON.parse(item.customization) : {},
          resources: []
        })) : [];
        setProducts(mappedProducts);
      }
      setLoading(false);
    });
  }, [id]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSaveStatus = () => {
    ajaxRequest('PUT', `/api/orders/${id}`, { status }, (error) => {
      if (error) {
        console.error("Background update failed:", error);
      }
    });

    navigate('/admin/orders', {
      state: {
        toast: {
          message: 'Order status updated successfully!',
          type: 'success'
        }
      }
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  );

  if (error || !orderDetails) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col">
      <Navbar userType="admin" />
      <div className="flex-grow flex items-center justify-center flex-col text-center px-4">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Order</h2>
        <p className="text-gray-500 mb-6">{error || 'Order not found'}</p>
        <button
          onClick={() => navigate('/admin/orders')}
          className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          Back to Orders
        </button>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar userType="admin" />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link to="/admin/orders" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manage Order #{orderDetails.orderId}</h1>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  {orderDetails.orderDate}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide border ${status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200' :
                status === 'CANCELLED' ? 'bg-red-100 text-red-700 border-red-200' :
                  'bg-blue-100 text-blue-700 border-blue-200'
                }`}>
                {status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Order Details & Items */}
          <div className="lg:col-span-2 space-y-8">

            {/* Client Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Client Information
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Name</label>
                  <p className="text-lg font-semibold text-gray-900">{orderDetails.client}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Email</label>
                  <p className="text-lg font-medium text-gray-700">{orderDetails.email}</p>
                </div>
                <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Shipping Address</label>
                  <p className="text-gray-700">{orderDetails.shippingAddress}</p>
                </div>
                <div className="md:col-span-2 border-t border-gray-100 pt-4">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Transaction ID</label>
                  <p className="text-gray-700 font-mono text-sm">{orderDetails.paymentId}</p>
                </div>
              </div>
            </div>

            {/* Order Items Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Order Items
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold tracking-wider border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4 text-center">Qty</th>
                      <th className="px-6 py-4 text-right">Price (Tax incl.)</th>
                      <th className="px-6 py-4 text-right">Total (Tax incl.)</th>
                      <th className="px-6 py-4">Resources</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {item.product}
                          {Object.keys(item.customization).length > 0 && (
                            <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                              {Object.entries(item.customization).map(([key, value]) => (
                                key !== 'files' && (
                                  <div key={key} className="flex gap-1">
                                    <span className="font-semibold capitalize">{key}:</span>
                                    <span>{value}</span>
                                  </div>
                                )
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-600">{item.quantity}</td>
                        <td className="px-6 py-4 text-right text-gray-600">{item.pricePerUnit}</td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900">{item.total}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {item.customization.files && item.customization.files.length > 0 ? item.customization.files.map((file, idx) => (
                              <a
                                key={idx}
                                href={file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-100"
                              >
                                <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                </svg>
                                File {idx + 1}
                              </a>
                            )) : <span className="text-xs text-gray-400 italic">No files</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Order Summary
                </h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>€{(orderDetails.total - (orderDetails.shippingCost || 0) - (orderDetails.taxAmount || 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>€{(orderDetails.shippingCost || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>€{(orderDetails.taxAmount || 0).toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total <span className="text-xs font-normal text-gray-500">(Tax included)</span></span>
                  <span className="font-bold text-xl text-blue-600">€{orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Actions */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-32">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Update Status
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
                  <Select
                    value={status}
                    onChange={handleStatusChange}
                    className="z-50"
                    options={[
                      { value: "PENDING", label: "Pending" },
                      { value: "IN_PROGRESS", label: "In Progress" },
                      { value: "COMPLETED", label: "Completed" },
                      { value: "CANCELLED", label: "Cancelled" }
                    ]}
                  />
                </div>

                <button
                  onClick={handleSaveStatus}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EditOrderAdmin;
