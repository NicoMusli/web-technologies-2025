import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';
import { ajaxRequest } from '../../utils/ajax';

const ManageProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taxRate, setTaxRate] = useState(0);
  const [toast, setToast] = useState(null);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.toast) {
      setToast(location.state.toast);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, settingsResponse] = await Promise.all([
          new Promise((resolve, reject) => ajaxRequest('GET', '/api/products', null, (err, data) => err ? reject(err) : resolve(data))),
          new Promise((resolve, reject) => ajaxRequest('GET', '/api/settings', null, (err, data) => err ? reject(err) : resolve(data)))
        ]);

        if (settingsResponse) {
          setTaxRate(settingsResponse.taxRate);
        }
        setAllProducts(productsResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
              <p className="text-gray-500 mt-1">View and manage your printing products catalog.</p>
            </div>
            <Link
              to="/admin/products/add"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 w-full md:w-auto justify-center"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white shadow-sm"
          />
          <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Products Grid */}
        {currentProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentProducts.map(product => {
                const originalTaxedPrice = product.price * (1 + taxRate);
                const discountedTaxedPrice = product.onSale && product.discountPercentage
                  ? originalTaxedPrice * (1 - product.discountPercentage / 100)
                  : originalTaxedPrice;

                return (
                  <div key={product.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
                    {/* Image Container */}
                    <div className="relative h-56 bg-gray-100 overflow-hidden">
                      <img
                        src={product.image || '/logo_without_background.png'}
                        alt={product.name}
                        className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ${!product.image ? 'p-8 object-contain opacity-50' : ''}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.category && (
                          <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            {product.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1" title={product.name}>{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>

                      <div className="mt-auto">
                        <div className="flex items-end justify-between mb-4">
                          <div className="flex flex-col">
                            {product.onSale && product.discountPercentage ? (
                              <>
                                <span className="text-sm text-gray-400 line-through mb-0.5">€{originalTaxedPrice.toFixed(2)}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl font-bold text-gray-900">€{discountedTaxedPrice.toFixed(2)}</span>
                                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">
                                    -{product.discountPercentage}%
                                  </span>
                                </div>
                              </>
                            ) : (
                              <span className="text-2xl font-bold text-gray-900">€{originalTaxedPrice.toFixed(2)}</span>
                            )}
                            <span className="text-[10px] text-gray-400 mt-1">
                              Base: €{product.price.toFixed(2)} + Tax
                            </span>
                          </div>
                        </div>

                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="block w-full py-3 bg-gray-900 hover:bg-blue-600 text-white rounded-xl font-bold text-center transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Product
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-12">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {searchTerm ? 'No products found' : 'No products yet'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              {searchTerm
                ? 'Try adjusting your search terms.'
                : 'Start by adding your first product to the catalog.'}
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
                to="/admin/products/add"
                className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30"
              >
                Add Your First Product
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

export default ManageProducts;
