import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';
import Modal from '../../components/Modal';
import { ajaxRequest } from '../../utils/ajax';

const OrderChangeRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectError, setRejectError] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = () => {
        ajaxRequest('GET', '/api/order-change-requests', null, (error, data) => {
            if (!error) {
                setRequests(data);
            }
            setLoading(false);
        });
    };

    const openApproveModal = (requestId) => {
        setSelectedRequestId(requestId);
        setIsApproveModalOpen(true);
    };

    const openRejectModal = (requestId) => {
        setSelectedRequestId(requestId);
        setRejectReason('');
        setRejectError('');
        setIsRejectModalOpen(true);
    };

    const handleApprove = () => {
        if (!selectedRequestId) return;

        ajaxRequest('PUT', `/api/order-change-requests/${selectedRequestId}`,
            { status: 'APPROVED', adminNotes: 'Approved' },
            (error) => {
                if (!error) {
                    setToast({ message: 'Request approved successfully!', type: 'success' });
                    fetchRequests();
                } else {
                    setToast({ message: 'Error approving request.', type: 'error' });
                }
                setIsApproveModalOpen(false);
                setSelectedRequestId(null);
            }
        );
    };

    const handleReject = () => {
        if (!selectedRequestId) return;
        if (!rejectReason.trim()) {
            setRejectError('Please provide a reason for rejection.');
            return;
        }

        ajaxRequest('PUT', `/api/order-change-requests/${selectedRequestId}`,
            { status: 'REJECTED', adminNotes: rejectReason },
            (error) => {
                if (!error) {
                    setToast({ message: 'Request rejected successfully!', type: 'success' });
                    fetchRequests();
                } else {
                    setToast({ message: 'Error rejecting request.', type: 'error' });
                }
                setIsRejectModalOpen(false);
                setSelectedRequestId(null);
                setRejectReason('');
                setRejectError('');
            }
        );
    };

    const filteredRequests = requests.filter(request => {
        const order = request.order || {};
        const user = order.user || {};
        const searchString = searchTerm.toLowerCase();

        return (
            request.orderId.toString().includes(searchString) ||
            (user.firstName && user.firstName.toLowerCase().includes(searchString)) ||
            (user.lastName && user.lastName.toLowerCase().includes(searchString)) ||
            (user.email && user.email.toLowerCase().includes(searchString))
        );
    });

    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRequests = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                    <h1 className="text-3xl font-bold text-gray-900">Order Change Requests</h1>
                    <p className="text-gray-500 mt-1">Review and approve/reject customer modification requests.</p>
                </div>
            </div>

            <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">

                {/* Search Bar */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by Order ID, Name or Email..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
                    />
                    <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {requests.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No pending change requests</h3>
                        <p className="text-gray-500">All change requests have been processed.</p>
                    </div>
                ) : currentRequests.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {currentRequests.map(request => {
                                let details = {};
                                try {
                                    details = request.changeDetails ? JSON.parse(request.changeDetails) : {};
                                } catch (e) {
                                    console.error('Error parsing change details:', e);
                                }

                                const order = request.order || {};
                                const user = order.user || {};
                                const items = order.items || [];

                                return (
                                    <div key={request.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
                                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                                            <div className="flex items-center justify-between">
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${request.changeType === 'CANCEL' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {request.changeType}
                                                </span>
                                                <span className="text-white text-sm font-medium">
                                                    {new Date(request.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6 space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order ID</p>
                                                    <p className="font-bold text-gray-900">#{request.orderId}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order Total</p>
                                                    <p className="font-bold text-gray-900">€{order.total ? order.total.toFixed(2) : '0.00'}</p>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Customer</p>
                                                <p className="font-semibold text-gray-900">{user.firstName || 'Unknown'} {user.lastName || ''}</p>
                                                <p className="text-sm text-gray-600">{user.email || 'No email'}</p>
                                            </div>

                                            {details.reason && (
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Reason</p>
                                                    <p className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-gray-900">{details.reason}</p>
                                                </div>
                                            )}

                                            {details.request && (
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Requested Changes</p>
                                                    <p className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-gray-900">{details.request}</p>
                                                </div>
                                            )}

                                            {items.length > 0 && (
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Order Items</p>
                                                    <ul className="space-y-1">
                                                        {items.map(item => (
                                                            <li key={item.id} className="text-sm text-gray-600 flex justify-between">
                                                                <span>{item.product?.name || 'Unknown Product'} x {item.quantity}</span>
                                                                <span className="font-medium">€{item.price ? item.price.toFixed(2) : '0.00'}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                                                <button
                                                    onClick={() => openApproveModal(request.id)}
                                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/30"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => openRejectModal(request.id)}
                                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/30"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-3">
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No requests found</h3>
                        <p className="text-gray-500">Try adjusting your search terms.</p>
                    </div>
                )}
            </div>

            <Footer />

            {/* Approve Modal */}
            <Modal
                isOpen={isApproveModalOpen}
                onClose={() => setIsApproveModalOpen(false)}
                title="Approve Request"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">Are you sure you want to approve this change request?</p>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => setIsApproveModalOpen(false)}
                            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApprove}
                            className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-500/30"
                        >
                            Confirm Approval
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Reject Modal */}
            <Modal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                title="Reject Request"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">Please provide a reason for rejecting this request:</p>
                    <div className="space-y-2">
                        <textarea
                            value={rejectReason}
                            onChange={(e) => {
                                setRejectReason(e.target.value);
                                if (e.target.value.trim()) setRejectError('');
                            }}
                            placeholder="Reason for rejection..."
                            rows="4"
                            className={`w-full px-4 py-3 rounded-xl border ${rejectError ? 'border-red-500 focus:ring-red-500/10' : 'border-gray-200 focus:border-red-500 focus:ring-red-500/10'} focus:ring-4 outline-none transition-all resize-none`}
                        />
                        {rejectError && (
                            <p className="text-sm text-red-600 font-medium animate-in slide-in-from-top-1">
                                {rejectError}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => setIsRejectModalOpen(false)}
                            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleReject}
                            className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
                        >
                            Reject Request
                        </button>
                    </div>
                </div>
            </Modal>

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

export default OrderChangeRequests;
