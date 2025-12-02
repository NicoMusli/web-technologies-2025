import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';
import Modal from '../../components/Modal';
import { ajaxRequest } from '../../utils/ajax';
import Select from '../../components/Select';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [productData, setProductData] = useState({
    name: '',
    type: '',
    description: '',
    price: '',
    sizeFormat: '',
    onSale: false,

    formConfig: ''
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [newMainImage, setNewMainImage] = useState(null);

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

  useEffect(() => {
    ajaxRequest('GET', `/api/products/${id}`, null, (error, data) => {
      if (!error) {
        setProductData({
          name: data.name,
          type: data.category || '',
          description: data.description,
          price: data.price.toString(),
          sizeFormat: data.sizeFormat || '',
          onSale: data.onSale || false,
          discountPercentage: data.discountPercentage ? data.discountPercentage.toString() : '',

        });

        if (data.formConfig) {
          try {
            const parsedConfig = JSON.parse(data.formConfig);
            const formattedConfig = parsedConfig.map(field => ({
              ...field,
              options: Array.isArray(field.options) ? field.options.join(', ') : field.options
            }));
            setFormFields(formattedConfig);
          } catch (e) {
            console.error("Error parsing formConfig", e);
            setFormFields([]);
          }
        }

        setMainImage(data.image);

        if (data.images) {
          try {
            const parsed = JSON.parse(data.images);
            setExistingImages(Array.isArray(parsed) ? parsed : []);
          } catch (e) {
            setExistingImages([]);
          }
        }
      }
      setLoading(false);
    });
  }, [id]);

  const handleChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value
    });
  };

  const handleMainImageUpload = (e) => {
    if (e.target.files[0]) {
      setNewMainImage(e.target.files[0]);
    }
  };

  const handleAdditionalImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + newImages.length + files.length;

    if (totalImages <= 5) {
      setNewImages([...newImages, ...files]);
    } else {
      setToast({
        message: 'You can upload maximum 5 additional images',
        type: 'warning'
      });
    }
  };

  const removeExistingImage = (index) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  };

  const removeNewImage = (index) => {
    const updated = [...newImages];
    updated.splice(index, 1);
    setNewImages(updated);
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

  const handleUpdate = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('category', productData.type);
    if (productData.sizeFormat) formData.append('sizeFormat', productData.sizeFormat);
    formData.append('onSale', productData.onSale);
    if (productData.discountPercentage) formData.append('discountPercentage', productData.discountPercentage);

    const configToSave = formFields.map(field => ({
      ...field,
      options: typeof field.options === 'string' ? field.options.split(',').map(o => o.trim()) : field.options
    }));
    formData.append('formConfig', JSON.stringify(configToSave));

    if (newMainImage) {
      formData.append('image', newMainImage);
    }

    formData.append('existingImages', JSON.stringify(existingImages));

    newImages.forEach(file => {
      formData.append('images', file);
    });

    ajaxRequest('PUT', `/api/products/${id}`, formData, (error, data) => {
      if (error) {
        console.error("Background save failed:", error);
      }
    });

    navigate('/admin/products', {
      state: {
        toast: {
          message: 'Product updated successfully!',
          type: 'success'
        }
      }
    });
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    ajaxRequest('DELETE', `/api/products/${id}`, null, (error) => {
      if (!error) {
        setToast({
          message: 'Product deleted!',
          type: 'success'
        });
        setTimeout(() => navigate('/admin/products'), 2000);
      } else {
        setToast({
          message: 'Error deleting product',
          type: 'error'
        });
        setShowDeleteModal(false);
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
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-gray-500 mt-1">Update product details and manage inventory</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Information */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-bold text-gray-900">Product Information</h2>
                <p className="text-sm text-gray-500 mt-1">Edit your product details</p>
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
                          {field.type === 'select' && <span className="text-sm text-gray-500 ml-2">[{Array.isArray(field.options) ? field.options.join(', ') : field.options}]</span>}
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

            {/* Main Image */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-bold text-gray-900">Main Image</h2>
                <p className="text-sm text-gray-500 mt-1">Primary product image</p>
              </div>
              <div className="p-6 space-y-4">
                <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group">
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-semibold text-gray-900">Change Main Image</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleMainImageUpload} className="hidden" />
                </label>

                <div className="aspect-square rounded-xl border-2 border-gray-200 bg-gray-50 overflow-hidden relative">
                  {newMainImage ? (
                    <img src={URL.createObjectURL(newMainImage)} alt="New Main" className="w-full h-full object-cover" />
                  ) : mainImage ? (
                    <img src={mainImage} alt="Main" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Images */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-bold text-gray-900">Gallery Images</h2>
                <p className="text-sm text-gray-500 mt-1">Up to 5 additional images</p>
              </div>

              <div className="p-6 space-y-4">
                <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group">
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-semibold text-gray-900">Add Images</p>
                  </div>
                  <input type="file" accept="image/*" multiple onChange={handleAdditionalImageUpload} className="hidden" />
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {/* Existing Images */}
                  {existingImages.map((img, index) => (
                    <div key={`existing-${index}`} className="aspect-square rounded-xl border-2 border-gray-200 bg-gray-50 overflow-hidden relative group">
                      <img src={img} alt={`Existing ${index}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {/* New Images */}
                  {newImages.map((img, index) => (
                    <div key={`new-${index}`} className="aspect-square rounded-xl border-2 border-blue-200 bg-blue-50 overflow-hidden relative group">
                      <img src={URL.createObjectURL(img)} alt={`New ${index}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleDelete}
                className="w-full bg-white hover:bg-red-50 text-red-600 font-bold py-3 px-6 rounded-xl border-2 border-red-200 hover:border-red-300 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Product
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/admin/products')}
                  className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-6 rounded-xl border border-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update
                </button>
              </div>
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

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Product"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditProduct;
