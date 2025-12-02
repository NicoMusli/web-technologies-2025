import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ajaxRequest } from '../../utils/ajax';
import DateInput from '../../components/DateInput';

const Payments = () => {
  const [allInvoices, setAllInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ajaxRequest('GET', '/api/payments', null, (error, data) => {
      if (!error) {
        const mapped = data.map(p => ({
          invoiceId: `PAY${p.id}`,
          transactionId: p.stripePaymentId,
          orderId: `ORD${p.orderId}`,
          date: new Date(p.createdAt).toLocaleDateString(),
          amount: `€${p.amount.toFixed(2)}`,
          status: p.status === 'SUCCEEDED' ? 'Paid' : p.status === 'PENDING' ? 'Pending' : 'Failed',
          billingAddress: p.order?.billingAddress || 'Same as shipping'
        }));
        setAllInvoices(mapped);
      }
      setLoading(false);
    });
  }, []);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredInvoices = allInvoices.filter(invoice =>
    invoice.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (invoice.transactionId && invoice.transactionId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Failed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-500';
      case 'Pending': return 'bg-yellow-500';
      case 'Failed': return 'bg-red-500';
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
          <h1 className="text-3xl font-bold text-gray-900">Payments & Invoices</h1>
          <p className="text-gray-500 mt-1">Track payments and manage billing.</p>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">

        {/* Search and Date Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by Transaction ID, Invoice ID or Order ID..."
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

          <div className="flex gap-2 w-full md:w-auto">
            <DateInput
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Start Date"
              className="w-full md:w-40"
            />
            <span className="self-center text-gray-400">-</span>
            <DateInput
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="End Date"
              className="w-full md:w-40"
            />
          </div>
        </div>

        {/* Invoices Grid */}
        {currentInvoices.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentInvoices.map(invoice => (
                <div key={invoice.invoiceId} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="overflow-hidden">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Transaction No.</p>
                      <h3 className="text-sm font-bold text-gray-900 break-all font-mono bg-gray-50 p-1 rounded border border-gray-100 inline-block mb-2">
                        {invoice.transactionId || 'N/A'}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Invoice:</span>
                        <span className="text-xs font-medium text-gray-600">{invoice.invoiceId}</span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(invoice.status)}`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${getStatusDot(invoice.status)}`}></span>
                      {invoice.status}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order ID</p>
                      <p className="font-semibold text-blue-600">{invoice.orderId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date</p>
                      <p className="font-medium text-gray-900">{invoice.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Billing Address</p>
                      <p className="font-medium text-gray-900 text-sm">{invoice.billingAddress}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Amount</p>
                    <p className="text-3xl font-bold text-gray-900">{invoice.amount}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-3">
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
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm
                ? 'Try adjusting your search terms.'
                : 'No payment records available.'}
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Payments;
