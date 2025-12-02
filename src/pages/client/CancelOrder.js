import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';
import { ajaxRequest } from '../../utils/ajax';
import Select from '../../components/Select';

const CancelOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reason, setReason] = useState('Changed my mind');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [order, setOrder] = useState(null);
  const [pendingRequest, setPendingRequest] = useState(null);

  useEffect(() => {
    ajaxRequest('GET', `/api/orders/${id}`, null, (error, data) => {
      if (!error) {
        setOrder(data);
      }
    });

    ajaxRequest('GET', `/api/order-change-requests/order/${id}`, null, (error, data) => {
      if (!error && data && data.length > 0) {
        const pending = data.find(req => req.status === 'PENDING');
        if (pending) {
          setPendingRequest(pending);
        }
      }
    });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const changeDetails = {
      reason,
      notes
    };

    ajaxRequest('POST', '/api/order-change-requests', {
      orderId: id,
      changeType: 'CANCEL',
      changeDetails
    }, (error, data) => {
      if (error) {
        console.error("Background cancellation request failed:", error);
      }
    });

    navigate('/client/my-orders', {
      state: {
        toast: {
          message: 'Cancellation request submitted successfully!',
          type: 'success'
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar userType="client" />

      <div className="flex-grow max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-red-50 to-white">
            <h1 className="text-2xl font-bold text-red-700 flex items-center gap-3">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Cancel Order
            </h1>
            <p className="text-red-600/80 mt-2 ml-11">
              {order ? `Order placed on ${new Date(order.createdAt).toLocaleDateString()} at ${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Loading order details...'}
            </p>
          </div>

          {order && order.status === 'CANCELLED' ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Order Already Cancelled</h3>
              <p className="text-gray-500 mb-6">
                This order has already been cancelled. No further action is required.
              </p>
              <button
                onClick={() => navigate('/client/my-orders')}
                className="px-6 py-3 bg-gray-600 text-white font-bold rounded-xl hover:bg-gray-700 transition-all shadow-lg shadow-gray-500/30"
              >
                Back to Orders
              </button>
            </div>
          ) : pendingRequest ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Request Already Pending</h3>
              <p className="text-gray-500 mb-6">
                You already have a pending {pendingRequest.changeType === 'CANCEL' ? 'cancellation' : 'modification'} request for this order.
                Please wait for the admin to process your current request before submitting a new one.
              </p>
              <button
                onClick={() => navigate(`/client/my-orders/${id}`)}
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
              >
                View Request Status
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Cancellation</label>
                <Select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  options={[
                    { value: "Changed my mind", label: "Changed my mind" },
                    { value: "Found better price", label: "Found better price" },
                    { value: "No longer needed", label: "No longer needed" },
                    { value: "Ordered by mistake", label: "Ordered by mistake" },
                    { value: "Quality concerns", label: "Quality concerns" },
                    { value: "Other", label: "Other" }
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all resize-none"
                  placeholder="Please provide any additional details..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          )}
        </div>
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

export default CancelOrder;
