import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z\s]*$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>\-_])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>\-_]{8,}$/;

    if (!formData.username) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Min 3 characters';

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';

    if (!formData.firstName) newErrors.firstName = 'Required';
    else if (!nameRegex.test(formData.firstName)) newErrors.firstName = 'Invalid characters';

    if (!formData.lastName) newErrors.lastName = 'Required';
    else if (!nameRegex.test(formData.lastName)) newErrors.lastName = 'Invalid characters';

    if (!formData.password) newErrors.password = 'Required';
    else if (!passwordRegex.test(formData.password)) newErrors.password = 'Weak password (min 8 chars, A-Z, 0-9, special)';

    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    register(formData, (error, data) => {
      if (error) {
        setServerError(error.message || 'Registration failed. Email may already be in use.');
      } else {
        navigate('/client/customer-area');
      }
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar userType="visitor" />

      <div className="flex-grow flex items-center justify-center p-4 sm:px-6 lg:px-8 relative overflow-hidden py-24">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-gray-50 -z-10"></div>
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">

          {/* Left Side - Image/Branding */}
          <div className="md:w-5/12 bg-gray-900 relative p-12 flex flex-col justify-between text-white overflow-hidden order-last md:order-first">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-700 to-blue-600 opacity-90"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            <img
              src="/homeimage.jpeg"
              alt="Register Background"
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
            />

            <div className="relative z-10">
              <h2 className="text-4xl font-extrabold tracking-tight mb-4">Join Us Today</h2>
              <p className="text-purple-100 text-lg">Create an account to start your printing journey with ACSA Print.</p>
            </div>

            <div className="relative z-10 mt-12 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold">Fast & Easy</h4>
                  <p className="text-sm text-purple-100">Get started in minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold">Exclusive Offers</h4>
                  <p className="text-sm text-purple-100">Access member-only deals</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-7/12 p-8 md:p-12 lg:p-16">
            <div className="text-center md:text-left mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h3>
              <p className="text-gray-500">Fill in your details to sign up</p>
            </div>

            {serverError && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium">{serverError}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all`}
                    placeholder="John"
                  />
                  {errors.firstName && <p className="mt-1 text-xs text-red-500 font-medium">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all`}
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="mt-1 text-xs text-red-500 font-medium">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.username ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all`}
                  placeholder="johndoe123"
                />
                {errors.username && <p className="mt-1 text-xs text-red-500 font-medium">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all`}
                    placeholder="••••••••"
                  />
                  {errors.password && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all`}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-500 font-medium">{errors.confirmPassword}</p>}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-blue-500/30 mt-4"
              >
                Create Account
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
