import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../utils/api';
import Toast from '../../components/Toast';

interface Category {
  category_id: string;
  name: string;
}

interface ExistingProductImage {
  id: number;
  url: string;
  is_primary?: boolean;
}

interface ProductState {
  product_id: number;
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  is_active: boolean;
  stock_quantity: number;
  category_id: string;
  images?: ExistingProductImage[];
}

const AddProductPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as { product?: ProductState } | null;
  const editingProduct = state?.product;

  const [productData, setProductData] = useState({
    name: editingProduct?.name ?? '',
    category_id: editingProduct?.category_id?.toString() ?? '',
    price: editingProduct ? String(editingProduct.price) : '',
    discount_price: editingProduct && editingProduct.discount_price !== null ? String(editingProduct.discount_price) : '',
    stock_quantity: editingProduct ? String(editingProduct.stock_quantity) : '',
    sku: '',
    description: editingProduct?.description ?? '',
    status: editingProduct?.is_active ? '1' : '0'
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingProductImage[]>(editingProduct?.images ?? []);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [newImages, setNewImages] = useState<{ file: File; previewUrl: string; is_primary: boolean }[]>([]);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const navigate = useNavigate();

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.data || response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setToast({ message: 'Failed to load categories', type: 'error' });
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExistingImageRemove = (id: number) => {
    setExistingImages(prev => prev.filter(img => img.id !== id));
    setDeletedImageIds(prev => [...prev, id]);
  };

  const handleNewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setNewImages(prev => {
      const startEmpty = prev.length === 0 && existingImages.length === 0;
      return [
        ...prev,
        ...files.map((file, index) => ({
          file,
          previewUrl: URL.createObjectURL(file),
          is_primary: startEmpty && index === 0,
        })),
      ];
    });
  };

  const handleSetPrimaryNewImage = (index: number) => {
    setNewImages(prev => prev.map((img, i) => ({
      ...img,
      is_primary: i === index,
    })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!productData.name || !productData.category_id || !productData.price || !productData.stock_quantity) {
      setToast({ message: 'Please fill in all required fields', type: 'error' });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append('name', productData.name);
      formData.append('description', productData.description || '');
      formData.append('price', productData.price);
      if (productData.discount_price) {
        formData.append('discount_price', productData.discount_price);
      }
      formData.append('stock_quantity', productData.stock_quantity);
      formData.append('category_id', productData.category_id);
      formData.append('is_active', productData.status); // '1' or '0'

      // Existing images to delete
      deletedImageIds.forEach(id => {
        formData.append('deleted_image_ids[]', String(id));
      });

      // New image files
      newImages.forEach(img => {
        formData.append('images_files[]', img.file);
      });

      // Primary index among new images (if any new images)
      const primaryIndex = newImages.findIndex(img => img.is_primary);
      if (primaryIndex >= 0) {
        formData.append('primary_index', String(primaryIndex));
      }

      if (editingProduct) {
        formData.append('_method', 'PUT');
        await api.post(`/products/${editingProduct.product_id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setToast({ message: 'Product updated successfully!', type: 'success' });
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setToast({ message: 'Product added successfully!', type: 'success' });
      }

      // Redirect to products page after a delay
      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);

    } catch (error: any) {
      console.error('Error saving product:', error);
      let errorMessage = 'Failed to save product. Please try again.';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const firstErrorField = Object.keys(error.response.data.errors)[0];
        const firstError = error.response.data.errors[firstErrorField][0];
        errorMessage = firstError;
      }

      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const closeToast = () => {
    setToast(null);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      <div className="mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-gray-600 mt-1">{editingProduct ? 'Update an existing product' : 'Create a new product for your store'}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Product Information</h2>
            <p className="text-gray-600 text-sm mt-1">Basic details about your product</p>
          </div>

          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={productData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter product name"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category_id"
                name="category_id"
                value={productData.category_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.category_id} value={category.category_id}>{category.name}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={productData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-3 py-2 sm:pr-4 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Discount Price */}
            <div>
              <label htmlFor="discount_price" className="block text-sm font-medium text-gray-700 mb-1">
                Discount Price
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                <input
                  type="number"
                  id="discount_price"
                  name="discount_price"
                  value={productData.discount_price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-3 py-2 sm:pr-4 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Stock Quantity */}
            <div>
              <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                id="stock_quantity"
                name="stock_quantity"
                value={productData.stock_quantity}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter quantity"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={productData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={productData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Brief description of the product"
              />
            </div>
          </div>

          {/* Images Section */}
          <div className="p-4 sm:p-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
            <p className="text-gray-500 text-sm mb-4">Upload one or more images from your device. You can also remove existing images.</p>

            {/* Existing images (editing only) */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Existing Images</h4>
                <div className="flex flex-wrap gap-3">
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                      <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                      {img.is_primary && (
                        <span className="absolute top-1 left-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">Primary</span>
                      )}
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]"
                        onClick={() => handleExistingImageRemove(img.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New image upload */}
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleNewImagesChange}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />

              {newImages.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-2">
                  {newImages.map((img, index) => (
                    <div key={index} className="flex flex-col items-center gap-1">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                        <img src={img.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <label className="inline-flex items-center text-xs text-gray-700">
                        <input
                          type="radio"
                          name="primaryNewImage"
                          className="mr-1"
                          checked={img.is_primary}
                          onChange={() => handleSetPrimaryNewImage(index)}
                        />
                        Primary
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-end gap-2 sm:gap-3">
            <Link
              to="/admin/products"
              className="px-4 py-2 sm:px-6 sm:py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 sm:px-6 sm:py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 shadow-md disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                editingProduct ? 'Update Product' : 'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;