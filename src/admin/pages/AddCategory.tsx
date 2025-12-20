import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import api from '../../utils/api';
import Toast from '../../components/Toast';
import { useAuth } from '../../contexts/AuthContext';

const AddCategory: React.FC = () => {
  const location = useLocation();
  const state = location.state as { category?: { category_id: string; name: string; description: string } } | null;
  const editingCategory = state?.category;

  const [categoryData, setCategoryData] = useState({
    name: editingCategory?.name || '',
    description: editingCategory?.description || ''
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (editingCategory) {
      setCategoryData({
        name: editingCategory.name || '',
        description: editingCategory.description || ''
      });
    }
  }, [editingCategory]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategoryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is authenticated and is admin
    if (!user) {
      setToast({ message: 'You must be logged in to create a category', type: 'error' });
      return;
    }

    if (user.role !== 'admin') {
      setToast({ message: 'Access denied. You must be an administrator to create categories.', type: 'error' });
      return;
    }

    if (!categoryData.name.trim()) {
      setToast({ message: 'Category name is required', type: 'error' });
      return;
    }

    try {
      setLoading(true);

      if (editingCategory) {
        await api.put(`/categories/${editingCategory.category_id}`, categoryData);
        setToast({ message: 'Category updated successfully!', type: 'success' });
      } else {
        // Make API call to save category
        await api.post('/categories', categoryData);

        // Show success toast
        setToast({ message: 'Category created successfully!', type: 'success' });
      }

      // Redirect to category list after successful creation
      setTimeout(() => {
        navigate('/admin/categories');
      }, 1500);
    } catch (err: any) {
      console.error('Error saving category:', err);
      let errorMessage = 'Failed to save category. Please try again.';

      // Handle different types of errors
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in as an administrator.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. You must be an administrator to create categories.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        // Handle validation errors
        const firstErrorField = Object.keys(err.response.data.errors)[0];
        const firstError = err.response.data.errors[firstErrorField][0];
        errorMessage = firstError;
      } else if (err.message) {
        errorMessage = err.message;
      }

      // Show error toast
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const closeToast = () => {
    setToast(null);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{editingCategory ? 'Edit Category' : 'Add New Category'}</h1>
          <p className="text-gray-600 mt-1">{editingCategory ? 'Update an existing product category' : 'Create a new product category'}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Category Information</h2>
            <p className="text-gray-600 text-sm mt-1">Basic details about your category</p>
          </div>

          <div className="p-4 sm:p-6 grid grid-cols-1 gap-4 sm:gap-6">
            {/* Category Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={categoryData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter category name"
              />
              <p className="text-xs text-gray-500 mt-1">This will be displayed to customers</p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={categoryData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter category description"
              />
              <p className="text-xs text-gray-500 mt-1">Brief description of what products belong to this category</p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-end gap-2 sm:gap-3">
            <Link
              to="/admin/categories"
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
                <>
                  <span className="material-symbols-outlined text-lg mr-2">save</span>
                  {editingCategory ? 'Update Category' : 'Save Category'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;