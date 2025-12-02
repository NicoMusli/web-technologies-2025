import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ajaxRequest } from '../../utils/ajax';
import { countries } from '../../constants/countries';
import Select from '../../components/Select';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ total, cartItems, clearCart, settings, formData, setFormData, handleChange, setOrderCompleted }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (cartItems.length === 0) {
      setToast({ message: 'Your cart is empty', type: 'warning' });
      return;
    }

    setProcessing(true);

    ajaxRequest('POST', '/api/payments/create-payment-intent', { amount: total }, async (err, data) => {
      if (err) {
        setError('Failed to initialize payment');
        setProcessing(false);
        return;
      }

      const clientSecret = data.clientSecret;

      const selectedCountry = countries.find(c => c.name === formData.country);
      const shippingCountryCode = selectedCountry ? selectedCountry.code : 'US';

      let billingDetails = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: {
          line1: formData.address,
          city: formData.city,
          postal_code: formData.zipCode,
          country: shippingCountryCode
        }
      };

      if (!formData.sameBillingAddress) {
        const selectedBillingCountry = countries.find(c => c.name === formData.billingCountry);
        const billingCountryCode = selectedBillingCountry ? selectedBillingCountry.code : 'US';

        billingDetails.address = {
          line1: formData.billingAddress,
          city: formData.billingCity,
          postal_code: formData.billingZipCode,
          country: billingCountryCode
        };
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: billingDetails,
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          const shippingAddress = `${formData.address}, ${formData.city}, ${formData.zipCode}, ${formData.country}`;

          let billingAddress = shippingAddress;
          if (!formData.sameBillingAddress) {
            billingAddress = `${formData.billingAddress}, ${formData.billingCity}, ${formData.billingZipCode}, ${formData.billingCountry}`;
          }

          const orderData = {
            items: cartItems,
            shippingAddress,
            billingAddress,
            paymentId: result.paymentIntent.id
          };

          ajaxRequest('POST', '/api/orders', orderData, (orderErr, orderRes) => {
            if (orderErr) {
              setError('Payment successful but order creation failed. Please contact support.');
              setProcessing(false);
            } else {
              setToast({ message: 'Order placed successfully!', type: 'success' });
              setOrderCompleted(true);
              clearCart();
              setTimeout(() => navigate('/client/customer-area'), 2000);
            }
          });
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Shipping Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
          <p className="text-sm text-gray-500 mt-1">Enter your delivery details</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
              <Select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                options={[
                  { value: "", label: "Select Country" },
                  ...countries.map(c => ({ value: c.name, label: c.name }))
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Billing Address Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">Billing Address</h2>
          <p className="text-sm text-gray-500 mt-1">Select your billing country</p>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              id="sameBillingAddress"
              name="sameBillingAddress"
              checked={formData.sameBillingAddress}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="sameBillingAddress" className="text-gray-700 font-medium cursor-pointer select-none">
              Billing country is the same as shipping country
            </label>
          </div>

          {!formData.sameBillingAddress && (
            <div className="animate-fade-in-down space-y-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Billing Address *</label>
                <input
                  type="text"
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleChange}
                  required={!formData.sameBillingAddress}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Billing City *</label>
                  <input
                    type="text"
                    name="billingCity"
                    value={formData.billingCity}
                    onChange={handleChange}
                    required={!formData.sameBillingAddress}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Billing ZIP Code *</label>
                  <input
                    type="text"
                    name="billingZipCode"
                    value={formData.billingZipCode}
                    onChange={handleChange}
                    required={!formData.sameBillingAddress}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Billing Country *</label>
                <Select
                  name="billingCountry"
                  value={formData.billingCountry}
                  onChange={handleChange}
                  required
                  options={[
                    { value: "", label: "Select Billing Country" },
                    ...countries.map(c => ({ value: c.name, label: c.name }))
                  ]}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">Payment Information</h2>
          <p className="text-sm text-gray-500 mt-1">Secure payment processing</p>
        </div>

        <div className="p-6">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900">Secure Payment</p>
                <p className="text-xs text-gray-600">Powered by Stripe</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <CardElement options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }} />
            </div>

            {error && (
              <div className="mt-4 text-red-500 text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center gap-2 mt-6 text-gray-400">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs">SSL Encrypted Payment</span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-blue-500/30 text-lg flex items-center justify-center gap-3 ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {processing ? (
          <span>Processing...</span>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Place Order (€{total.toFixed(2)})</span>
          </>
        )}
      </button>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </form>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, loading } = useAuth();
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [settings, setSettings] = useState({ shippingCost: 0, taxRate: 0 });
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    billingAddress: '',
    billingCity: '',
    billingZipCode: '',
    billingCountry: '',
    sameBillingAddress: false
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  useEffect(() => {
    ajaxRequest('GET', '/api/settings', null, (error, data) => {
      if (!error && data) {
        setSettings(data);
      }
      setLoadingSettings(false);
    });
  }, []);

  useEffect(() => {
    if (user) {
      ajaxRequest('GET', `/api/users/${user.id}`, null, (error, data) => {
        if (!error && data) {
          setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || '',
            zipCode: data.zipCode || '',
            country: data.country || ''
          });
        }
      });
    }
  }, [user]);

  const subtotalExclTax = getCartTotal();
  const taxAmount = subtotalExclTax * settings.taxRate;
  const subtotalInclTax = subtotalExclTax + taxAmount;
  const shipping = subtotalExclTax > 0 ? settings.shippingCost : 0;
  const total = subtotalInclTax + shipping;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    setTimeout(() => navigate('/login'), 100);
    return null;
  }

  if (cartItems.length === 0 && !orderCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md mx-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Please add items to your cart before proceeding to checkout.</p>
          <button
            onClick={() => navigate('/products')}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-blue-500/30"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  if (orderCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md mx-4">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Successful!</h2>
          <p className="text-gray-500 mb-8">Redirecting to your dashboard...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar userType="visitor" />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-500 mt-1">Complete your order securely</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            <Elements stripe={stripePromise}>
              <CheckoutForm
                total={total}
                cartItems={cartItems}
                clearCart={clearCart}
                settings={settings}
                formData={formData}
                setFormData={setFormData}
                handleChange={handleChange}
                setOrderCompleted={setOrderCompleted}
              />
            </Elements>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                <p className="text-sm text-gray-500 mt-1">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
              </div>

              <div className="p-6">
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-100 max-h-64 overflow-y-auto">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        {item.onSale && item.originalPrice > item.price && (
                          <div className="text-xs text-gray-400 line-through">
                            €{(item.originalPrice * (1 + settings.taxRate) * item.quantity).toFixed(2)}
                          </div>
                        )}
                        <span className="font-bold text-gray-900">€{(item.price * (1 + settings.taxRate) * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal (Tax Incl.)</span>
                    <span className="font-medium">€{subtotalInclTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {loadingSettings ? (
                        <span className="inline-block w-12 h-4 bg-gray-200 rounded animate-pulse"></span>
                      ) : (
                        `€${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax ({loadingSettings ? '...' : (settings.taxRate * 100).toFixed(0)}%)</span>
                    <span className="font-medium">
                      {loadingSettings ? (
                        <span className="inline-block w-12 h-4 bg-gray-200 rounded animate-pulse"></span>
                      ) : (
                        <span className="text-sm text-gray-500">Included: €{taxAmount.toFixed(2)}</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {loadingSettings ? (
                      <span className="inline-block w-24 h-8 bg-gray-200 rounded animate-pulse"></span>
                    ) : (
                      `€${total.toFixed(2)}`
                    )}
                  </span>
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

export default Checkout;
