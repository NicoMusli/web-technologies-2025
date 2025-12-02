import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import { ajaxRequest } from '../../utils/ajax';

const Cart = () => {
  const { cartItems, removeFromCart, getCartTotal, updateCartItemQuantity } = useCart();
  const [settings, setSettings] = useState({ shippingCost: 0, taxRate: 0 });
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    ajaxRequest('GET', '/api/settings', null, (error, data) => {
      if (!error && data) {
        setSettings(data);
      }
      setLoadingSettings(false);
    });
  }, []);

  const subtotalExclTax = getCartTotal();
  const taxAmount = subtotalExclTax * settings.taxRate;
  const subtotalInclTax = subtotalExclTax + taxAmount;
  const shipping = subtotalExclTax > 0 ? settings.shippingCost : 0;
  const total = subtotalInclTax + shipping;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar userType="visitor" />

      <div className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Shopping Cart</h1>
            <p className="mt-2 text-lg text-gray-500">Review your items and proceed to checkout</p>
          </div>
          <span className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-16 text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-subtle">
              <svg className="w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-lg text-gray-600 mb-10 max-w-md mx-auto">Looks like you haven't added any items to your cart yet. Explore our products to find something you love.</p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/30"
            >
              Start Shopping
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-6">
              {cartItems.map(item => (
                <div key={item.id} className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.type || 'Product'}</p>
                        {item.customization && Object.keys(item.customization).length > 0 && (
                          <div className="mt-2 space-y-1">
                            {Object.entries(item.customization).map(([key, value]) => (
                              key !== 'files' && (
                                <p key={key} className="text-sm text-gray-600">
                                  <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span> {value}
                                </p>
                              )
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Remove item"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex flex-col items-end mt-6">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 mb-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">Qty</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
                          >
                            -
                          </button>
                          <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">
                          €{(item.price * (1 + settings.taxRate)).toFixed(2)} / unit
                        </div>
                        {item.onSale && item.originalPrice > item.price && (
                          <div className="text-sm text-gray-400 line-through mb-1">
                            €{(item.originalPrice * (1 + settings.taxRate) * item.quantity).toFixed(2)}
                          </div>
                        )}
                        <div className="text-2xl font-bold text-gray-900">
                          €{(item.price * (1 + settings.taxRate) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 sticky top-32">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Order Summary</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Subtotal (Tax Incl.)</span>
                    <span className="font-medium text-gray-900">€{subtotalInclTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Shipping Estimate</span>
                    <span className="font-medium text-gray-900">
                      {loadingSettings ? (
                        <span className="inline-block w-12 h-4 bg-gray-200 rounded animate-pulse"></span>
                      ) : (
                        `€${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Tax ({loadingSettings ? '...' : (settings.taxRate * 100).toFixed(0)}%)</span>
                    <span className="font-medium text-gray-900">
                      {loadingSettings ? (
                        <span className="inline-block w-12 h-4 bg-gray-200 rounded animate-pulse"></span>
                      ) : (
                        <span className="text-sm text-gray-500">Included: €{taxAmount.toFixed(2)}</span>
                      )}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-3xl font-bold text-blue-600">
                      {loadingSettings ? (
                        <span className="inline-block w-24 h-8 bg-gray-200 rounded animate-pulse"></span>
                      ) : (
                        `€${total.toFixed(2)}`
                      )}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link
                    to="/checkout"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>

                  <Link
                    to="/products"
                    className="block w-full bg-white hover:bg-gray-50 text-gray-700 text-center font-bold py-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all"
                  >
                    Continue Shopping
                  </Link>
                </div>

                <div className="mt-8 flex items-center justify-center gap-4 text-gray-400">
                  <div className="flex flex-col items-center gap-1">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-[10px] uppercase tracking-wider font-medium">Secure</span>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div className="flex flex-col items-center gap-1">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[10px] uppercase tracking-wider font-medium">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
