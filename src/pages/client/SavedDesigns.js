import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { ajaxRequest } from '../../utils/ajax';

const SavedDesigns = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (user) {
      ajaxRequest('GET', '/api/favorites', null, (error, data) => {
        if (!error) {
          setFavorites(data);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  const removeFavorite = (productId) => {
    if (window.confirm('Remove from favorites?')) {
      ajaxRequest('DELETE', `/api/favorites/${productId}`, null, (error) => {
        if (!error) {
          setFavorites(prev => prev.filter(f => f.productId !== productId));
        }
      });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  );

  const filteredFavorites = favorites.filter(({ product }) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFavorites.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFavorites = filteredFavorites.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar userType="client" />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Saved Designs</h1>
              <p className="text-gray-500 mt-1">Your favorite products and templates in one place.</p>
            </div>

            {/* Search Bar */}
            {favorites.length > 0 && (
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Search your favorites..."
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
            )}
          </div>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {favorites.length > 0 ? (
          <>
            {currentFavorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentFavorites.map(({ product }) => (
                  <div key={product.id} className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100">
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={product.image || "/example.png"}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                      <button
                        onClick={() => removeFavorite(product.id)}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-all shadow-lg flex items-center justify-center group/btn"
                        title="Remove from favorites"
                      >
                        <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white drop-shadow-lg">{product.name}</h3>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{product.description}</p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          {product.onSale && product.discountPercentage ? (
                            <>
                              <p className="text-sm text-gray-400 line-through">€{product.price.toFixed(2)}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-blue-600">
                                  €{(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
                                </span>
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-md">
                                  -{product.discountPercentage}%
                                </span>
                              </div>
                            </>
                          ) : (
                            <span className="text-2xl font-bold text-gray-900">€{product.price.toFixed(2)}</span>
                          )}
                        </div>
                        <Link
                          to={`/services/${product.slug || product.id}`}
                          className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
                        >
                          View
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No designs found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                  We couldn't find any saved designs matching your search. Try adjusting your search terms.
                </p>
                <button
                  onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                  className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl"
                >
                  Clear Search
                </button>
              </div>
            )}

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
            <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No saved designs yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Start browsing our products and save your favorites by clicking the heart icon!
            </p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SavedDesigns;
