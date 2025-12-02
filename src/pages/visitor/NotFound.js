import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar userType="visitor" />

            <div className="flex-grow flex flex-col items-center justify-center px-4 text-center">
                <div className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transform hover:scale-105 transition-transform duration-300">
                    <div className="text-9xl font-black text-gray-200 mb-4 select-none">
                        404
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Oops! Page not found
                    </h1>

                    <p className="text-gray-600 mb-8 text-lg">
                        It seems you have lost your way. The page you are looking for does not exist or has been moved.
                    </p>

                    <div className="space-y-4">
                        <Link
                            to="/"
                            className="block w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                        >
                            Go back to Home
                        </Link>

                        <Link
                            to="/products"
                            className="block w-full py-3 px-6 bg-white border-2 border-gray-200 hover:border-blue-400 text-gray-700 font-semibold rounded-xl transition-all"
                        >
                            See our products
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default NotFound;
