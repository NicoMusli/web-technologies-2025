import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ajaxRequest } from '../../utils/ajax';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from '../../components/InvoicePDF';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        setLoading(true);
        ajaxRequest('GET', `/api/orders/${id}`, null, (err, data) => {
            if (err) {
                setError('Order not found or access denied');
                setLoading(false);
            } else {
                setOrder(data);
                ajaxRequest('GET', `/api/order-change-requests/order/${id}`, null, (reqErr, reqData) => {
                    if (!reqErr && reqData) {
                        setRequests(reqData);
                    }
                    setLoading(false);
                });
            }
        });
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
    );

    if (error || !order) return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar userType="client" />
            <div className="flex-grow flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-500 mb-6">{error || 'Order not found'}</p>
                    <Link to="/client/customer-area" className="text-blue-600 hover:underline">Return to Dashboard</Link>
                </div>
            </div>
            <Footer />
        </div>
    );

    const latestRequest = requests.length > 0 ? requests[0] : null;
    const isPending = latestRequest && latestRequest.status === 'PENDING';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar userType="client" />

            <div className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Order from {new Date(order.createdAt).toLocaleDateString()}
                            </h1>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-gray-500">Placed at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <Link to="/client/my-orders" className="text-gray-500 hover:text-gray-700 font-medium flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Orders
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Status Alert for Latest Request */}
                        {latestRequest && (
                            <div className={`rounded-2xl p-6 border ${latestRequest.status === 'APPROVED' ? 'bg-green-50 border-green-200' :
                                latestRequest.status === 'REJECTED' ? 'bg-red-50 border-red-200' :
                                    'bg-yellow-50 border-yellow-200'
                                }`}>
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-full ${latestRequest.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                                        latestRequest.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                                            'bg-yellow-100 text-yellow-600'
                                        }`}>
                                        {latestRequest.status === 'APPROVED' && (
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                        {latestRequest.status === 'REJECTED' && (
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        )}
                                        {latestRequest.status === 'PENDING' && (
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className={`text-lg font-bold ${latestRequest.status === 'APPROVED' ? 'text-green-900' :
                                            latestRequest.status === 'REJECTED' ? 'text-red-900' :
                                                'text-yellow-900'
                                            }`}>
                                            {latestRequest.status === 'PENDING' ? 'Request Under Review' :
                                                latestRequest.status === 'APPROVED' ? 'Request Approved' : 'Request Rejected'}
                                        </h3>
                                        <p className={`mt-1 ${latestRequest.status === 'APPROVED' ? 'text-green-700' :
                                            latestRequest.status === 'REJECTED' ? 'text-red-700' :
                                                'text-yellow-700'
                                            }`}>
                                            {latestRequest.status === 'PENDING'
                                                ? 'Your request is currently being reviewed by an administrator. You will be notified once a decision is made.'
                                                : `Your request from ${new Date(latestRequest.createdAt).toLocaleDateString()} was ${latestRequest.status.toLowerCase()}.`
                                            }
                                        </p>
                                        {latestRequest.adminNotes && (
                                            <div className="mt-3 bg-white/50 p-3 rounded-lg border border-black/5">
                                                <p className="text-sm font-medium opacity-75 uppercase tracking-wider mb-1">Admin Note:</p>
                                                <p className="font-medium">{latestRequest.adminNotes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Items */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50">
                                <h2 className="font-bold text-gray-900">Order Items</h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {order.items.map((item, index) => {
                                    let customization = {};
                                    try {
                                        customization = JSON.parse(item.customization || '{}');
                                    } catch (e) { }

                                    return (
                                        <div key={index} className="p-6 flex gap-4">
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                                {item.product.image ? (
                                                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Img</div>
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-gray-900">{item.product.name}</h3>
                                                    <span className="font-medium text-gray-900">
                                                        €{((item.price * (1 + (order.taxAmount / (order.total - order.shippingCost - order.taxAmount)))) * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 mb-2">
                                                    Quantity: {item.quantity} × €{(item.price * (1 + (order.taxAmount / (order.total - order.shippingCost - order.taxAmount)))).toFixed(2)}
                                                </p>

                                                {/* Customization Details */}
                                                {Object.keys(customization).length > 0 && (
                                                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 space-y-1">
                                                        {Object.entries(customization).map(([key, value]) => (
                                                            key !== 'files' && (
                                                                <div key={key} className="flex justify-between">
                                                                    <span className="capitalize text-gray-500">{key}:</span>
                                                                    <span className="font-medium">{value}</span>
                                                                </div>
                                                            )
                                                        ))}
                                                        {customization.files && customization.files.length > 0 && (
                                                            <div className="mt-2 pt-2 border-t border-gray-200">
                                                                <span className="block text-gray-500 mb-1">Uploaded Files:</span>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {customization.files.map((file, i) => (
                                                                        <a key={i} href={file} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs bg-blue-50 px-2 py-1 rounded">
                                                                            File {i + 1}
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                                <>
                                    {isPending ? (
                                        <div className="flex-1 bg-gray-100 border border-gray-200 text-gray-400 font-bold py-3 rounded-xl text-center cursor-not-allowed flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            Request Pending
                                        </div>
                                    ) : (
                                        <>
                                            <Link to={`/client/my-orders/edit/${order.id}`} className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-center shadow-sm">
                                                Request Changes
                                            </Link>
                                            <Link to={`/client/my-orders/cancel/${order.id}`} className="flex-1 bg-white border border-red-200 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all text-center shadow-sm">
                                                Cancel Order
                                            </Link>
                                        </>
                                    )}
                                </>
                            )}
                            <PDFDownloadLink
                                document={<InvoicePDF order={order} />}
                                fileName={`invoice-${order.id}.pdf`}
                                className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 text-center"
                            >
                                {({ blob, url, loading, error }) =>
                                    loading ? 'Generating Invoice...' : 'Download Invoice'
                                }
                            </PDFDownloadLink>
                        </div>

                        {/* Request History */}
                        {requests.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h2 className="text-xl font-bold text-gray-900">Request History</h2>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {requests.map((req) => (
                                        <div key={req.id} className="p-6 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-500">
                                                    {new Date(req.createdAt).toLocaleDateString()} at {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${req.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                    req.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {req.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-900 font-medium mb-2">
                                                <span className="text-gray-500 font-normal mr-2">
                                                    {req.changeType === 'CANCEL' ? 'Cancellation Reason:' : 'Modification Request:'}
                                                </span>
                                                {req.changeDetails ? (
                                                    req.changeType === 'CANCEL'
                                                        ? JSON.parse(req.changeDetails).reason
                                                        : JSON.parse(req.changeDetails).request
                                                ) : 'No details'}
                                            </p>
                                            {req.adminNotes && (
                                                <p className="text-sm text-gray-500 bg-gray-100 p-3 rounded-lg">
                                                    <span className="font-bold">Admin:</span> {req.adminNotes}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Shipping Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50">
                                <h3 className="font-bold text-gray-900">Shipping Details</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="mt-1 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-gray-900 font-medium block mb-1">Delivery Address</p>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {order.shippingAddress}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50">
                                <h3 className="font-bold text-gray-900">Payment Summary</h3>
                            </div>
                            <div className="p-6 space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>€{(order.total - (order.shippingCost || 0) - (order.taxAmount || 0)).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>€{(order.shippingCost || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (20%)</span>
                                    <span>€{(order.taxAmount || 0).toFixed(2)}</span>
                                </div>
                                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Total <span className="text-xs font-normal text-gray-500">(Tax included)</span></span>
                                    <span className="font-bold text-xl text-blue-600">€{order.total.toFixed(2)}</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Paid via Credit Card
                                    </div>
                                    {order.paymentId && (
                                        <p className="text-xs text-gray-400 mt-1 truncate">ID: {order.paymentId}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default OrderDetails;
