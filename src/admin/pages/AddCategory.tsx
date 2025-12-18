import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AddCategory: React.FC = () => {
  const [categoryData, setCategoryData] = useState({
    name: '',
    description: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategoryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryData.name.trim()) {
      setError('Category name is required');
      return;
    }
    
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Redirect to category list after successful creation
      navigate('/admin/categories');
    }, 1000);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add New Category</h1>
          <p className="text-gray-600 mt-1">Create a new product category</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Category Information</h2>
            <p className="text-gray-600 text-sm mt-1">Basic details about your category</p>
          </div>
          
          {error && (
            <div className="p-4 sm:p-6">
              <div className="rounded-lg bg-red-50 p-4 border border-red-100">
                <div className="flex">
                  <span className="material-symbols-outlined text-red-500">error</span>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-1 text-sm text-red-700">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
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
                  Save Category
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