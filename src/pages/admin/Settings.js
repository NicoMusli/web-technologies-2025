import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ajaxRequest } from '../../utils/ajax';
import Select from '../../components/Select';

const Settings = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({
        shippingCost: 0,
        taxRate: 0,
        currency: 'EUR'
    });
    const [message, setMessage] = useState(null);

    useEffect(() => {
        ajaxRequest('GET', '/api/settings', null, (error, data) => {
            if (!error && data) {
                setSettings({
                    shippingCost: data.shippingCost,
                    taxRate: data.taxRate * 100,
                    currency: data.currency
                });
            }
            setLoading(false);
        });
    }, []);

    const handleChange = (e) => {
        setSettings({
            ...settings,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const dataToSend = {
            shippingCost: parseFloat(settings.shippingCost),
            taxRate: parseFloat(settings.taxRate) / 100,
            currency: settings.currency
        };

        ajaxRequest('PUT', '/api/settings', dataToSend, (error, response) => {
            if (!error) {
                setMessage({ type: 'success', text: 'Settings updated successfully!' });
                setTimeout(() => setMessage(null), 3000);

                ajaxRequest('GET', '/api/settings', null, (err, data) => {
                    if (!err && data) {
                        setSettings({
                            shippingCost: data.shippingCost,
                            taxRate: data.taxRate * 100,
                            currency: data.currency
                        });
                    }
                });
            } else {
                const errorMsg = response && typeof response === 'object' ? response.error || 'Unknown error' : error.message;
                setMessage({ type: 'error', text: `Error updating settings: ${errorMsg}` });
            }
        });
    };

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
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>
                            <p className="text-gray-500 mt-1">Configure shipping costs and tax rates.</p>
                        </div>
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                {message && (
                    <div className={`mb-6 px-6 py-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <h2 className="text-xl font-bold text-gray-900">Pricing Configuration</h2>
                        <p className="text-sm text-gray-500 mt-1">These values will be used for all orders</p>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Shipping Cost (€)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-gray-500 font-medium">€</span>
                                <input
                                    type="number"
                                    name="shippingCost"
                                    value={settings.shippingCost}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    required
                                    className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
                                    placeholder="5.00"
                                />
                            </div>
                            <p className="mt-2 text-xs text-gray-500">Standard shipping fee applied to all orders</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tax Rate (%)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="taxRate"
                                    value={settings.taxRate}
                                    onChange={handleChange}
                                    step="0.1"
                                    min="0"
                                    max="100"
                                    required
                                    className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
                                    placeholder="20"
                                />
                                <span className="absolute right-4 top-3.5 text-gray-500 font-medium">%</span>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">VAT or sales tax percentage (e.g., 20 for 20%)</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Currency
                            </label>
                            <Select
                                name="currency"
                                value={settings.currency}
                                onChange={handleChange}
                                required
                                options={[
                                    { value: "EUR", label: "EUR (€)" },
                                    { value: "USD", label: "USD ($)" },
                                    { value: "GBP", label: "GBP (£)" },
                                    { value: "MAD", label: "MAD (د.م.)" }
                                ]}
                            />
                            <p className="mt-2 text-xs text-gray-500">Currency for all transactions in the store</p>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="text-sm text-blue-800">
                                        <p className="font-semibold mb-1">Security Notice</p>
                                        <p>These settings directly affect order totals. Changes will apply to all new orders immediately. Existing orders will not be affected.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save Settings
                        </button>
                    </div>
                </form>

                {/* Preview Section */}
                <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Preview</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Sample Subtotal:</span>
                            <span className="font-medium">€100.00</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping:</span>
                            <span className="font-medium">€{parseFloat(settings.shippingCost || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tax ({settings.taxRate}%):</span>
                            <span className="font-medium">€{(100 * parseFloat(settings.taxRate || 0) / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-3 border-t border-gray-200 text-base">
                            <span className="font-bold text-gray-900">Total:</span>
                            <span className="font-bold text-blue-600">€{(100 + parseFloat(settings.shippingCost || 0) + (100 * parseFloat(settings.taxRate || 0) / 100)).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Settings;
