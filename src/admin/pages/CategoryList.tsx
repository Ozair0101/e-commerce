import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 'CAT001',
      name: 'Electronics',
      description: 'Devices and gadgets including smartphones, laptops, and accessories',
      productCount: 42
    },
    {
      id: 'CAT002',
      name: 'Clothing',
      description: 'Apparel for men, women, and children',
      productCount: 28
    },
    {
      id: 'CAT003',
      name: 'Home & Kitchen',
      description: 'Furniture, decor, and kitchen appliances',
      productCount: 35
    },
    {
      id: 'CAT004',
      name: 'Beauty',
      description: 'Skincare, makeup, and personal care products',
      productCount: 19
    },
    {
      id: 'CAT005',
      name: 'Sports',
      description: 'Equipment and apparel for various sports activities',
      productCount: 15
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'products') return b.productCount - a.productCount;
    return 0;
  });

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Manage product categories</p>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <span className="material-symbols-outlined text-lg">search</span>
                </span>
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Sort */}
              <select
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="products">Sort by Product Count</option>
              </select>
            </div>
            
            <div className="flex gap-2 sm:gap-3">
              <button className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">download</span>
                <span className="hidden sm:inline">Export</span>
              </button>
              <Link 
                to="/admin/add-category"
                className="px-3 py-2 sm:px-4 sm:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                <span className="hidden sm:inline">Add Category</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 sm:py-4 sm:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="text-left py-3 px-4 sm:py-4 sm:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Description</th>
                  <th className="text-left py-3 px-4 sm:py-4 sm:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                  <th className="text-right py-3 px-4 sm:py-4 sm:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedCategories.length > 0 ? (
                  sortedCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 sm:py-4 sm:px-6">
                        <div className="font-medium text-gray-900 text-sm sm:text-base">{category.name}</div>
                        <div className="text-xs text-gray-500 md:hidden mt-1">
                          {category.description}
                        </div>
                      </td>
                      <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-900 hidden md:table-cell">
                        {category.description}
                      </td>
                      <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-900">
                        {category.productCount}
                      </td>
                      <td className="py-3 px-4 sm:py-4 sm:px-6 text-right">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <button className="p-1.5 sm:p-2 text-gray-500 hover:text-orange-500 rounded-full hover:bg-orange-50">
                            <span className="material-symbols-outlined text-base sm:text-lg">visibility</span>
                          </button>
                          <button className="p-1.5 sm:p-2 text-gray-500 hover:text-orange-500 rounded-full hover:bg-orange-50">
                            <span className="material-symbols-outlined text-base sm:text-lg">edit</span>
                          </button>
                          <button 
                            className="p-1.5 sm:p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <span className="material-symbols-outlined text-base sm:text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 sm:py-12 px-4 sm:px-6 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <span className="material-symbols-outlined text-4xl sm:text-5xl text-gray-300 mb-3 sm:mb-4">category</span>
                        <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-1">No categories found</h3>
                        <p className="text-gray-500 text-sm sm:text-base">Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="border-t border-gray-200 px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedCategories.length}</span> of{' '}
              <span className="font-medium">{sortedCategories.length}</span> results
            </div>
            <div className="flex gap-1 sm:gap-2">
              <button className="px-2.5 py-1 sm:px-3 sm:py-1 rounded-md border border-gray-200 text-xs sm:text-sm text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-2.5 py-1 sm:px-3 sm:py-1 rounded-md bg-orange-500 text-white text-xs sm:text-sm">1</button>
              <button className="px-2.5 py-1 sm:px-3 sm:py-1 rounded-md border border-gray-200 text-xs sm:text-sm text-gray-500 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;