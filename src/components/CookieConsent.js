import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consentData = localStorage.getItem('cookieConsent');

        if (consentData) {
            const { timestamp } = JSON.parse(consentData);
            const now = new Date().getTime();
            const oneYear = 365 * 24 * 60 * 60 * 1000;

            if (now - timestamp > oneYear) {
                localStorage.removeItem('cookieConsent');
                setIsVisible(true);
            }
        } else {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        const consentData = {
            value: true,
            timestamp: new Date().getTime()
        };
        localStorage.setItem('cookieConsent', JSON.stringify(consentData));
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-full duration-500">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="hidden md:flex p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            Cookie Policy
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-2xl">
                            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                            By clicking "Accept", you consent to our use of cookies.
                            <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                                Learn more
                            </a>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={handleAccept}
                        className="w-full md:w-auto px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
