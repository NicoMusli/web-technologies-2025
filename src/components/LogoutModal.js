import React from 'react';
import ReactDOM from 'react-dom';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm p-4 md:inset-0">
            <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 transform transition-all scale-100 opacity-100">
                <div className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">Sign Out</h3>
                    <p className="mb-6 text-gray-500">Are you sure you want to sign out? You will need to login again to access your account.</p>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onClose}
                            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-colors shadow-lg shadow-red-200"
                        >
                            Yes, Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default LogoutModal;
