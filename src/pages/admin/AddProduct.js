import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';
import { ajaxRequest } from '../../utils/ajax';
import Select from '../../components/Select';

const AddProduct = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [productData, setProductData] = useState({
    name: '',
    type: '',
    description: '',
    price: '',
    sizeFormat: '',
    onSale: false,
    discountPercentage: ''
  });

  const [images, setImages] = useState([]);

  const [formFields, setFormFields] = useState([]);
  const [newField, setNewField] = useState({
    label: '',
    name: '',
    type: 'text',
    options: '',
    defaultValue: ''
  });

  const [taxRate, setTaxRate] = useState(0);

  useEffect(() => {
    ajaxRequest('GET', '/api/settings', null, (error, data) => {
      if (!error && data) {
        setTaxRate(data.taxRate);
      }
    });
  }, []);

  const handleChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length <= 5) {
      setImages([...images, ...files]);
    } else {
      setToast({
        message: 'You can upload maximum 5 images',
        type: 'warning'
      });
    }
  };

  const addField = () => {
    if (!newField.label || !newField.name) {
      setToast({
        message: 'Label and Name are required',
        type: 'warning'
      });
      return;
    }

    const fieldToAdd = {
      ...newField,
      options: newField.type === 'select' ? newField.options.split(',').map(o => o.trim()) : []
    };

    setFormFields([...formFields, fieldToAdd]);
    setNewField({ label: '', name: '', type: 'text', options: '', defaultValue: '' });
  };

  const removeField = (index) => {
    const updatedFields = [...formFields];
    updatedFields.splice(index, 1);
    setFormFields(updatedFields);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('category', productData.type);
    formData.append('onSale', productData.onSale);
    if (productData.sizeFormat) formData.append('sizeFormat', productData.sizeFormat);
    if (productData.discountPercentage) formData.append('discountPercentage', productData.discountPercentage);

    formData.append('formConfig', JSON.stringify(formFields));

    if (images.length > 0) {
      formData.append('image', images[0]);
      for (let i = 1; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }

    ajaxRequest('POST', '/api/products', formData, (error, data) => {
      if (error) {
        console.error("Background save failed:", error);
      }
    });
    navigate('/admin/products', {
      state: {
        toast: {
          message: 'Product added successfully!',
          type: 'success'
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar userType="admin" />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add Product</h1>
              <p className="text-gray-500 mt-1">Create a new printing product for your catalog</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-bold text-gray-900">Product Information</h2>
                <p className="text-sm text-gray-500 mt-1">Add your product details</p>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={productData.name}
                    onChange={handleChange}
                    placeholder="Enter product name (e.g., Flyer, Poster)"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Type *</label>
                  <Select
                    name="type"
                    value={productData.type}
                    onChange={handleChange}
                    required
                    options={[
                      { value: "", label: "Select type" },
                      { value: "Flyers", label: "Flyers" },
                      { value: "Posters", label: "Posters" },
                      { value: "Cards", label: "Cards" },
                      { value: "Brochures", label: "Brochures" },
                      { value: "Other", label: "Other" }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={productData.description}
                    onChange={handleChange}
                    placeholder="Enter product description..."
                    rows="4"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (€) *</label>
                    <input
                      type="number"
                      name="price"
                      value={productData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
                    />
                    {productData.price && (
                      <div className="mt-1 space-y-1">
                        <p className="text-xs text-gray-500">
                          With Tax ({Math.round(taxRate * 100)}%): <span className="font-bold text-gray-900">€{(parseFloat(productData.price) * (1 + taxRate)).toFixed(2)}</span>
                        </p>
                        {productData.onSale && productData.discountPercentage && (
                          <p className="text-xs text-blue-600">
                            Discounted Taxed Price: <span className="font-bold">€{(parseFloat(productData.price) * (1 + taxRate) * (1 - parseFloat(productData.discountPercentage) / 100)).toFixed(2)}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size/Format</label>
                    <input
                      type="text"
                      name="sizeFormat"
                      value={productData.sizeFormat}
                      onChange={handleChange}
                      placeholder="A5, A4, A3, A2, A1..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="onSale"
                    name="onSale"
                    checked={productData.onSale}
                    onChange={(e) => setProductData({ ...productData, onSale: e.target.checked })}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="onSale" className="text-sm font-semibold text-gray-700 cursor-pointer">Mark as On Sale</label>
                </div>

                {productData.onSale && (
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Discount Percentage (%) *</label>
                    <input
                      type="number"
                      name="discountPercentage"
                      value={productData.discountPercentage}
                      onChange={handleChange}
                      placeholder="Enter discount (e.g., 20 for 20% off)"
                      min="0"
                      max="100"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
                    />
                    <p className="text-xs text-gray-600 mt-2">Enter a value between 0 and 100</p>
                  </div>
                )}
              </div>
            </div>

            {/* Form Builder Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
                <h2 className="text-xl font-bold text-gray-900">Dynamic Form Configuration</h2>
                <p className="text-sm text-gray-500 mt-1">Define custom fields for this product</p>
              </div>

              <div className="p-6 space-y-6">
                {formFields.length > 0 && (
                  <div className="space-y-3">
                    {formFields.map((field, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex-1">
                          <span className="font-bold text-gray-900">{field.label}</span>
                          <span className="text-sm text-gray-500 ml-2">({field.type})</span>
                          {field.type === 'select' && <span className="text-sm text-gray-500 ml-2">[{field.options.join(', ')}]</span>}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeField(index)}
                          className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-6 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Label (e.g. Paper Type)"
                      value={newField.label}
                      onChange={e => setNewField({ ...newField, label: e.target.value })}
                      className="px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Field Name (e.g. paperType)"
                      value={newField.name}
                      onChange={e => setNewField({ ...newField, name: e.target.value })}
                      className="px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none"
                    />
                    <Select
                      value={newField.type}
                      onChange={e => setNewField({ ...newField, type: e.target.value })}
                      options={[
                        { value: "text", label: "Text Input" },
                        { value: "select", label: "Dropdown" },
                        { value: "file", label: "File Upload" }
                      ]}
                    />
                    {newField.type === 'select' && (
                      <input
                        type="text"
                        placeholder="Options (comma separated)"
                        value={newField.options}
                        onChange={e => setNewField({ ...newField, options: e.target.value })}
                        className="px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none"
                      />
                    )}
                    <button
                      type="button"
                      onClick={addField}
                      className="col-span-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-bold transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Field
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Product Images */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-bold text-gray-900">Product Images</h2>
                <p className="text-sm text-gray-500 mt-1">Upload up to 5 images</p>
              </div>

              <div className="p-6 space-y-4">
                <label htmlFor="image-upload" className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">Upload images</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div className="grid grid-cols-3 gap-3">
                  {images.map((img, index) => (
                    <div key={index} className="aspect-square rounded-xl border-2 border-gray-200 bg-gray-50 overflow-hidden relative group">
                      <img src={URL.createObjectURL(img)} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <div className="aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300 text-2xl font-light">
                      +
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Product
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-6 rounded-xl border border-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
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

export default AddProduct;
