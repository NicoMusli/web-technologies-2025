import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-950 text-gray-300 pt-16 pb-8 border-t border-gray-900">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6 text-center md:text-left">
            <Link to="/" className="inline-block">
              <img src="/logo_without_background.png" alt="ACSA Print" className="h-12 w-auto mx-auto md:mx-0 brightness-0 invert opacity-90" />
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-sm mx-auto md:mx-0">
              Your trusted partner for high-quality printing solutions. We bring your ideas to life with precision and care.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-6 text-white tracking-wide">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 underline">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 underline">Services</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 underline">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 underline">FAQ</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 underline">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 underline">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold mb-6 text-white tracking-wide">Contact Us</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex flex-col items-center md:items-end gap-1">
                <span className="text-blue-400 font-medium">Visit Us</span>
                <span>Résidence Ben Fateh, Rue Loubnane</span>
                <span>Marrakech 40000, Morocco</span>
              </li>
              <li className="flex flex-col items-center md:items-end gap-1">
                <span className="text-blue-400 font-medium">Call Us</span>
                <a href="tel:+212524420447" className="hover:text-white transition-colors underline">+212 5 24 42 04 47</a>
              </li>
              <li className="flex flex-col items-center md:items-end gap-1">
                <span className="text-blue-400 font-medium">Email Us</span>
                <a href="mailto:contact@acsaprint.com" className="hover:text-white transition-colors underline">contact@acsaprint.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-900 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} ACSA Print. All rights reserved.</p>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>Mon-Fri: 9:00 - 19:00</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                <span>Sat: 9:00 - 15:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
