import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';
import { ajaxRequest } from '../../utils/ajax';

const EditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [modificationRequest, setModificationRequest] = useState('');
  const [toast, setToast] = useState(null);
  const [pendingRequest, setPendingRequest] = useState(null);

  const [orderData, setOrderData] = useState({
    orderId: id,
    product: '',
    quantity: 0,
    deliveryAddress: '',
    createdAt: null,
    status: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        ajaxRequest('GET', `/api/orders/${id}`, null, (error, data) => {
          if (!error && data) {
            const firstItem = data.items && data.items.length > 0 ? data.items[0] : {};
            setOrderData({
              orderId: data.id,
              product: firstItem.product ? firstItem.product.name : 'Unknown Product',
              quantity: firstItem.quantity || 0,
              deliveryAddress: data.shippingAddress || '',
              createdAt: data.createdAt,
              status: data.status
            });
          }
        });

        ajaxRequest('GET', `/api/order-change-requests/order/${id}`, null, (error, data) => {
          if (!error && data) {
            const pending = data.find(req => req.status === 'PENDING');
            if (pending) {
              setPendingRequest(pending);
            }
          }
          setLoading(false);
        });

      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!modificationRequest.trim()) {
      setToast({
        message: 'Please describe the changes you would like to make.',
        type: 'warning'
      });
      return;
    }

    const changeDetails = {
      request: modificationRequest
    };

    ajaxRequest('POST', '/api/order-change-requests', {
      orderId: id,
      changeType: 'MODIFY',
      changeDetails
    }, (error, data) => {
      if (error) {
        console.error('Background update request failed:', error);
      }
    });

    navigate(`/client/my-orders/${id}`, {
      state: {
        toast: {
          message: 'Update request submitted successfully!',
          type: 'success'
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar userType="client" />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Request Order Modification
              </h1>
              <p className="text-gray-500 mt-1">
                {orderData.createdAt
                  ? `Order #${orderData.orderId} • ${new Date(orderData.createdAt).toLocaleDateString()}`
                  : 'Loading...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">

        {/* Current Order Details Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-xl font-bold text-gray-900">Current Order Details</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Product</label>
                <p className="font-semibold text-gray-900">{orderData.product}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Quantity</label>
                <p className="font-semibold text-gray-900">{orderData.quantity}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-2">Delivery Address</label>
                <p className="text-gray-900">{orderData.deliveryAddress || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${orderData.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  orderData.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                  {orderData.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Blocking Logic or Form */}
        {orderData.status === 'CANCELLED' ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Order Cancelled</h3>
            <p className="text-gray-600 mb-6">
              This order has been cancelled and cannot be modified further.
            </p>
            <button
              onClick={() => navigate(`/client/my-orders/${id}`)}
              className="px-6 py-3 bg-gray-600 text-white font-bold rounded-xl hover:bg-gray-700 transition-all shadow-lg shadow-gray-500/30"
            >
              Back to Order Details
            </button>
          </div>
        ) : pendingRequest ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Request Pending</h3>
            <p className="text-gray-600 mb-6">
              You already have a pending request for this order. Please wait for the administrator to review it before submitting a new one.
            </p>
            <button
              onClick={() => navigate(`/client/my-orders/${id}`)}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
            >
              View Request Status
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                <h2 className="text-xl font-bold text-gray-900">New Request</h2>
                <p className="text-sm text-gray-500 mt-1">Submit a new modification request</p>
              </div>
              <div className="p-6">
                <textarea
                  value={modificationRequest}
                  onChange={(e) => setModificationRequest(e.target.value)}
                  rows="6"
                  placeholder="Describe the changes you need..."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white resize-none font-medium"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={() => navigate(`/client/my-orders/${id}`)}
                className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
              >
                Submit Request
              </button>
            </div>
          </form>
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

export default EditOrder;
