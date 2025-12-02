import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ajaxRequest } from '../../utils/ajax';

import Select from '../../components/Select';

const ProductDetails = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isCustomQuantity, setIsCustomQuantity] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [toast, setToast] = useState(null);
    const [settings, setSettings] = useState({ taxRate: 0 });
    const [loadingSettings, setLoadingSettings] = useState(true);

    const [selectedImage, setSelectedImage] = useState(null);

    const [formValues, setFormValues] = useState({});
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (user && product) {
            ajaxRequest('GET', `/api/favorites/check/${product.id}`, null, (error, data) => {
                if (!error) {
                    setIsFavorite(data.isFavorite);
                }
            });
        }
    }, [user, product]);

    useEffect(() => {
        ajaxRequest('GET', '/api/settings', null, (error, data) => {
            if (!error && data) {
                setSettings(data);
            }
            setLoadingSettings(false);
        });
    }, []);

    const toggleFavorite = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (!product) return;

        if (isFavorite) {
            ajaxRequest('DELETE', `/api/favorites/${product.id}`, null, (error) => {
                if (!error) setIsFavorite(false);
            });
        } else {
            ajaxRequest('POST', '/api/favorites', { productId: product.id }, (error) => {
                if (!error) setIsFavorite(true);
            });
        }
    };

    useEffect(() => {
        setLoading(true);
        ajaxRequest('GET', `/api/products/${id}`, null, (err, data) => {
            if (err) {
                setError('Product not found');
            } else {
                setProduct(data);

                let initialImage = data.image;
                if (!initialImage && data.images) {
                    try {
                        const imgs = JSON.parse(data.images);
                        if (imgs.length > 0) initialImage = imgs[0];
                    } catch (e) { }
                }
                setSelectedImage(initialImage || '/example.png');

                if (data.formConfig) {
                    try {
                        const config = JSON.parse(data.formConfig);
                        const initialValues = {};
                        config.forEach(field => {
                            if (field.defaultValue) {
                                initialValues[field.name] = field.defaultValue;
                            } else if (field.type === 'select' && field.options && field.options.length > 0) {
                                initialValues[field.name] = field.options[0];
                            }
                        });
                        setFormValues(initialValues);
                    } catch (e) {
                        console.error("Error parsing form config", e);
                    }
                }

                if (data.sizeFormat) {
                    const sizes = data.sizeFormat.split(',').map(s => s.trim()).filter(Boolean);
                    if (sizes.length > 0) {
                        setFormValues(prev => ({ ...prev, sizeFormat: sizes[0] }));
                    }
                }
            }
            setLoading(false);
        });
    }, [id]);

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setUploadedFiles(prev => [...prev, ...files]);
    };

    const removeFile = (index) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleFieldChange = (name, value) => {
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddToCart = () => {
        if (!product) return;

        const proceedToAdd = (fileUrls = []) => {
            const customization = {
                ...formValues,
                files: fileUrls
            };

            const success = addToCart(
                {
                    id: product.id,
                    name: product.name,
                    price: currentPrice,
                    image: product.image
                },
                quantity,
                customization
            );

            if (success) {
                setToast({
                    message: 'Successfully added to cart!',
                    type: 'success'
                });
                setIsUploading(false);
                setUploadedFiles([]);
            } else {
                setToast({
                    message: 'Please login to add items to cart',
                    type: 'warning'
                });
                setTimeout(() => navigate('/login'), 1500);
            }
        };

        if (uploadedFiles.length > 0) {
            setIsUploading(true);
            const formData = new FormData();
            uploadedFiles.forEach(file => {
                formData.append('files', file);
            });

            ajaxRequest('POST', '/api/upload', formData, (err, data) => {
                if (err) {
                    setToast({ message: 'Error uploading files', type: 'error' });
                    setIsUploading(false);
                } else {
                    proceedToAdd(data.urls);
                }
            });
        } else {
            proceedToAdd();
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error || !product) return <div className="min-h-screen flex items-center justify-center text-red-500">{error || 'Product not found'}</div>;

    const formConfig = product.formConfig ? JSON.parse(product.formConfig) : [];
    const productImages = product.images ? JSON.parse(product.images) : [];
    const allImages = [product.image, ...productImages].filter(Boolean);

    const currentPrice = product.onSale && product.discountPercentage
        ? product.price * (1 + settings.taxRate) * (1 - product.discountPercentage / 100)
        : product.price * (1 + settings.taxRate);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar userType="visitor" />

            <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <div className="flex justify-between items-start">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                        <button
                            onClick={toggleFavorite}
                            className={`p-2 rounded-full transition-colors ${isFavorite ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-gray-400'}`}
                            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                        </button>
                    </div>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-[300px] md:min-h-[350px] lg:min-h-[400px] bg-gray-50 relative group">
                            <img
                                src={selectedImage || "/example.png"}
                                alt={product.name}
                                className="max-w-full max-h-[300px] md:max-h-[350px] lg:max-h-[400px] object-contain shadow-lg rounded-lg transition-all duration-300"
                            />
                        </div>
                        {allImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {allImages.map((img, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`aspect-square bg-white rounded-lg border p-2 flex items-center justify-center cursor-pointer transition-all ${selectedImage === img ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200 hover:border-blue-300'}`}
                                    >
                                        <img src={img} alt={`View ${idx}`} className="max-w-full max-h-full object-contain" />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Product Details</h3>
                            <div className="prose text-gray-600" dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br/>') }} />
                        </div>
                    </div>

                    {/* Customization Form */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 h-fit sticky top-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customize your order</h2>

                        <div className="space-y-6">
                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload your designs</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                            </svg>
                                            <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                                            <p className="text-xs text-gray-400 mt-1">Multiple files allowed</p>
                                        </div>
                                    </label>
                                </div>

                                {uploadedFiles.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {uploadedFiles.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex items-center text-sm text-gray-700 truncate">
                                                    <svg className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                    <span className="truncate">{file.name}</span>
                                                </div>
                                                <button
                                                    onClick={() => removeFile(index)}
                                                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Quantity Selector */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                    {isCustomQuantity ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                min="1"
                                                value={quantity}
                                                onChange={(e) => setQuantity(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                                                placeholder="Enter quantity"
                                            />
                                            <button
                                                onClick={() => {
                                                    setIsCustomQuantity(false);
                                                    setQuantity(1);
                                                }}
                                                className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-blue-200 font-medium"
                                            >
                                                Presets
                                            </button>
                                        </div>
                                    ) : (
                                        <Select
                                            value={quantity}
                                            onChange={(e) => {
                                                if (e.target.value === 'custom') {
                                                    setIsCustomQuantity(true);
                                                    setQuantity('');
                                                } else {
                                                    setQuantity(e.target.value);
                                                }
                                            }}
                                            options={[
                                                { value: "custom", label: "Custom Quantity" },
                                                { value: "1", label: "1" },
                                                { value: "10", label: "10" },
                                                { value: "20", label: "20" },
                                                { value: "50", label: "50" },
                                                { value: "100", label: "100" }
                                            ]}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Size Format Selector */}
                            {product.sizeFormat && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Size / Format</label>
                                    <Select
                                        value={formValues['sizeFormat'] || ''}
                                        onChange={(e) => handleFieldChange('sizeFormat', e.target.value)}
                                        options={product.sizeFormat.split(',').map(s => s.trim()).filter(Boolean).map(s => ({ value: s, label: s }))}
                                        placeholder="Select Size / Format"
                                    />
                                </div>
                            )}

                            {/* Dynamic Fields */}
                            {formConfig.map((field, index) => (
                                <div key={index}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                                    {field.type === 'select' ? (
                                        <Select
                                            value={formValues[field.name] || ''}
                                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                            options={field.options}
                                            placeholder={`Select ${field.label}`}
                                        />
                                    ) : field.type === 'text' ? (
                                        <input
                                            type="text"
                                            value={formValues[field.name] || ''}
                                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                                        />
                                    ) : null}
                                </div>
                            ))}

                            <div className="border-t border-gray-100 pt-6 mt-6">
                                <div className="flex justify-between items-start mb-2 text-gray-600">
                                    <div className="flex flex-col">
                                        <span>Unit Price:</span>
                                        <span className="text-xs text-gray-400">Tax included ({loadingSettings ? '...' : Math.round(settings.taxRate * 100)}%)</span>
                                    </div>
                                    <div className="text-right">
                                        {product.onSale && product.discountPercentage && (
                                            <div className="flex items-center justify-end gap-2 mb-1">
                                                <span className="text-sm text-gray-400 line-through">
                                                    {loadingSettings ? '...' : `€${(product.price * (1 + settings.taxRate)).toFixed(2)}`}
                                                </span>
                                                <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold">
                                                    -{product.discountPercentage}%
                                                </span>
                                            </div>
                                        )}
                                        <span className="font-medium text-gray-900">{loadingSettings ? '...' : `€${currentPrice.toFixed(2)}`}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mb-6 text-2xl font-bold text-gray-900">
                                    <span>Total ({quantity} items):</span>
                                    <span>{loadingSettings ? '...' : `€${(currentPrice * (quantity || 0)).toFixed(2)}`}</span>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={isUploading}
                                        className={`flex-1 font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-blue-200 ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                                    >
                                        {isUploading ? 'Uploading...' : 'Add to Cart'}
                                    </button>
                                    <Link to="/cart" className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all">
                                        View Cart
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default ProductDetails;
