import React, { useEffect, useState } from 'react';
import { ajaxRequest } from '../../utils/ajax';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Select from '../../components/Select';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taxRate, setTaxRate] = useState(0);

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

        const mappedProducts = productsResponse.map(p => {
          let imageUrl = p.image;
          if (!imageUrl && p.images) {
            try {
              const images = JSON.parse(p.images);
              if (Array.isArray(images) && images.length > 0) {
                imageUrl = images[0];
              }
            } catch (e) {
              console.error('Error parsing images JSON', e);
            }
          }
          return {
            ...p,
            image: imageUrl || '/example.png',
            link: `/products/${p.slug || p.id}`
          };
        });
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showOnSaleOnly, setShowOnSaleOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  let filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSale = showOnSaleOnly ? product.onSale : true;
    return matchesSearch && matchesSale;
  });

  filteredProducts.sort((a, b) => {
    const getPrice = (p) => {
      const basePrice = p.price * (1 + taxRate);
      return p.onSale && p.discountPercentage ? basePrice * (1 - p.discountPercentage / 100) : basePrice;
    };

    if (sortBy === 'price-asc') {
      return getPrice(a) - getPrice(b);
    } else if (sortBy === 'price-desc') {
      return getPrice(b) - getPrice(a);
    } else if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setShowOnSaleOnly(e.target.checked);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar userType="visitor" />

      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-12 md:py-16 lg:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 tracking-tight">Our Products</h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto font-light">
            Explore our comprehensive range of professional printing solutions designed to elevate your brand.
          </p>
        </div>
      </div>

      <div className="flex-grow -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 lg:pb-24">

          {/* Controls Container */}
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-8 md:mb-12 border border-gray-100 flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-5 py-3 pl-12 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-gray-50 focus:bg-white"
              />
              <svg
                className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Sort Dropdown */}
              <div className="relative w-full sm:w-48">
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  options={[
                    { value: "default", label: "Sort By: Default" },
                    { value: "price-asc", label: "Price: Low to High" },
                    { value: "price-desc", label: "Price: High to Low" },
                    { value: "name-asc", label: "Name: A-Z" },
                    { value: "name-desc", label: "Name: Z-A" }
                  ]}
                />
              </div>

              {/* Filter Toggle */}
              <label className="flex items-center justify-center gap-3 cursor-pointer bg-gray-50 hover:bg-blue-50 px-6 py-3 rounded-xl border border-gray-200 hover:border-blue-200 transition-all group w-full sm:w-auto">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={showOnSaleOnly}
                    onChange={handleFilterChange}
                    className="peer sr-only"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
                <span className="text-gray-700 font-semibold group-hover:text-blue-700 transition-colors">On Sale</span>
              </label>
            </div>
          </div>

          {/* Products Grid */}
          {currentProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {currentProducts.map(product => (
                <Link
                  to={`/products/${product.slug || product.id}`}
                  key={product.id}
                  className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
                >
                  <div className="relative h-48 md:h-56 lg:h-64 xl:h-72 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                    {product.onSale && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                        SALE
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-2xl font-bold text-white mb-1 shadow-black/50 drop-shadow-md">{product.name}</h3>
                    </div>
                  </div>

                  <div className="p-4 md:p-6 xl:p-8 flex-1 flex flex-col">
                    <p className="text-gray-600 mb-6 flex-1 line-clamp-3 leading-relaxed">{product.description}</p>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                      <div className="flex flex-col">
                        {product.onSale && product.discountPercentage ? (
                          <>
                            <span className="text-sm text-gray-400 line-through font-medium">
                              €{(product.price * (1 + taxRate)).toFixed(2)}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-blue-600">
                                €{(product.price * (1 + taxRate) * (1 - product.discountPercentage / 100)).toFixed(2)}
                              </span>
                              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-md">
                                -{product.discountPercentage}%
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Starting at</span>
                            <span className="text-2xl font-bold text-gray-900">
                              €{(product.price * (1 + taxRate)).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-blue-500/30">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 md:py-16 lg:py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="inline-block p-6 rounded-full bg-gray-50 mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                We couldn't find any services matching your search. Try adjusting your filters or search terms.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setShowOnSaleOnly(false); setSortBy('default'); }}
                className="mt-8 px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center gap-3">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md border border-gray-200'}`}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-12 h-12 rounded-xl font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 transform scale-110' : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md border border-gray-200'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md border border-gray-200'}`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Products;
