import React from 'react';

const Dashboard: React.FC = () => {
  // Sample data for the dashboard
  const stats = [
    { name: 'Total Sales', value: '$12,450.00', change: '+15.3%', changeType: 'positive' },
    { name: 'Active Orders', value: '45', change: '+5.2%', changeType: 'positive' },
    { name: 'Low Stock Items', value: '12', change: '-2.1%', changeType: 'negative' },
    { name: 'Total Visitors', value: '1,203', change: '+8.4%', changeType: 'positive' },
  ];

  const recentOrders = [
    { id: 'ORD001', customer: 'Sarah M.', date: '2 minutes ago', amount: '$125.99', status: 'Completed' },
    { id: 'ORD002', customer: 'John D.', date: '1 hour ago', amount: '$89.50', status: 'Processing' },
    { id: 'ORD003', customer: 'Emily R.', date: '3 hours ago', amount: '$210.75', status: 'Completed' },
    { id: 'ORD004', customer: 'Michael T.', date: '5 hours ago', amount: '$65.25', status: 'Shipped' },
  ];

  const popularProducts = [
    { name: 'Lavender Dream', category: 'Soy Wax, 8oz', status: 'In Stock', price: '$24.00', sold: '1,240' },
    { name: 'Vanilla Bean', category: 'Beeswax, 12oz', status: 'Low Stock', price: '$32.00', sold: '854' },
    { name: 'Midnight Pine', category: 'Soy Blend, 10oz', status: 'In Stock', price: '$28.00', sold: '620' },
  ];

  const recentActivity = [
    { id: 1, action: 'New Order #1024', description: 'placed by Sarah M.', time: '2 minutes ago', type: 'order' },
    { id: 2, action: 'Payment Received', description: 'for Order #1022', time: '1 hour ago', type: 'payment' },
    { id: 3, action: 'Stock Warning', description: 'for "Vanilla Bean"', time: '3 hours ago', type: 'warning' },
    { id: 4, action: 'New Review', description: '5 stars on "Lavender Dream"', time: '5 hours ago', type: 'review' },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10">
        {/* Page Heading & Date Filter */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Good morning, Admin! 👋</h2>
            <p className="text-gray-600 mt-1">Here's what's happening with your store today.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              <span>Oct 14 - Oct 21</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 shadow-md">
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>New Product</span>
            </button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors ${
                  index === 0 ? 'bg-blue-50 text-blue-600' : 
                  index === 1 ? 'bg-green-50 text-green-600' : 
                  index === 2 ? 'bg-yellow-50 text-yellow-600' : 
                  'bg-purple-50 text-purple-600'
                }`}>
                  <span className="material-symbols-outlined">
                    {index === 0 ? 'attach_money' : 
                     index === 1 ? 'shopping_cart' : 
                     index === 2 ? 'inventory_2' : 
                     'group'}
                  </span>
                </div>
                <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' ? 
                  'text-green-600 bg-green-50' : 
                  'text-red-600 bg-red-50'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.name}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
                <p className="text-sm text-gray-600">Comparing to previous month</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs font-bold bg-orange-500 text-white rounded-full">Weekly</button>
                <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-full transition-colors">Monthly</button>
              </div>
            </div>
            {/* Chart Visual */}
            <div className="h-64 w-full relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                {/* Grid lines */}
                <line stroke="#f3f4f6" strokeWidth="0.5" x1="0" x2="100" y1="0" y2="0"></line>
                <line stroke="#f3f4f6" strokeWidth="0.5" x1="0" x2="100" y1="12.5" y2="12.5"></line>
                <line stroke="#f3f4f6" strokeWidth="0.5" x1="0" x2="100" y1="25" y2="25"></line>
                <line stroke="#f3f4f6" strokeWidth="0.5" x1="0" x2="100" y1="37.5" y2="37.5"></line>
                {/* Area Fill */}
                <path d="M0,45 Q10,35 20,40 T40,20 T60,25 T80,10 T100,5 V50 H0 Z" fill="url(#gradient)" opacity="0.4"></path>
                {/* Stroke Line */}
                <path d="M0,45 Q10,35 20,40 T40,20 T60,25 T80,10 T100,5" fill="none" stroke="#ff9900" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                {/* Gradient Def */}
                <defs>
                  <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ff9900"></stop>
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                {/* Tooltip simulation */}
                <circle cx="60" cy="25" fill="#ff9900" r="2" stroke="white" strokeWidth="1"></circle>
                <g transform="translate(50, 10)">
                  <rect fill="#111814" height="10" rx="2" width="20" x="0" y="0"></rect>
                  <text fill="white" fontSize="3" fontWeight="bold" textAnchor="middle" x="10" y="6.5">$4.2k</text>
                </g>
              </svg>
              <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
          
          {/* Sales by Category */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Sales by Category</h3>
            <p className="text-sm text-gray-600 mb-6">Top performing product types</p>
            <div className="flex-1 flex flex-col justify-center items-center relative">
              {/* Donut Chart Visual */}
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Ring 1 */}
                  <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8"></path>
                  {/* Ring 2 (Value) */}
                  <path className="text-orange-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="60, 100" strokeLinecap="round" strokeWidth="3.8"></path>
                  {/* Ring 3 (Value) */}
                  <path className="text-orange-300" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="25, 100" strokeDashoffset="-60" strokeLinecap="round" strokeWidth="3.8"></path>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">85%</span>
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Electronics</span>
                </div>
              </div>
              <div className="w-full mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm font-medium text-gray-600">Electronics</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-300"></div>
                  <span className="text-sm font-medium text-gray-600">Clothing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                  <span className="text-sm font-medium text-gray-600">Other</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section: Popular Products & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Popular Products Table */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Popular Products</h3>
              <a className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors" href="#">View All</a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs text-gray-500 font-semibold border-b border-gray-100">
                    <th className="px-6 py-4 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 uppercase tracking-wider text-right">Price</th>
                    <th className="px-6 py-4 uppercase tracking-wider text-right">Sold</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {popularProducts.map((product, index) => (
                    <tr key={index} className="group hover:bg-gray-50 transition-colors border-b border-gray-100">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="size-12 rounded-lg bg-cover bg-center bg-gray-100" 
                               style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXu${index === 0 ? 'Apvx8B6YxK2SzprqzwV3ZUcd4uUM-E3CzPSarnGTqa1GhwsaARYMf9Dvp_jL1NlpdOgdhB3Ge5M8FNy2_9ERtnOKNzCjnvBGFqQj6yDWa4NMivH727RiN2Lc16GwA7U0mxHTfT-r22ax-XzXFl4m4fVAcdrEEtHGCTRqhpII1C0eyI0DcN11DV10JhkuDcTcecth2s1IwLwG2z7788kTPCk-8JlJ7e5bvH3seqz6MsHrqWm2dEcfmtBZYeRloJ4j_cBBvjfg_hBtEX' : index === 1 ? 'uC8dKD-q9r-4As_tfWAGrdkcAD3qXtInC5buyNpWLpz6pn5xQdvjisu4JwwTteEsa1d3dwlONifszuPBBOS6GAOWIBSGBQ3gMRYleb1RrjSZ-ZJaHZkcqogkPBCgQepfvyjH3hciL_Q-r2hIoR_kHBOTnqhlgWIyvumGZK5NpN6jD7EZ7Fcvb5Jw7xUmaa7wzT581YusTCxLHrUSbkZ8QDDN8jGROwQwyRGsNR-mB5HTvn_Zl1Q8kKw-M8-vrGEi20VKv32Jwq84dFA' : 'Ag4hAZjNPibDhbgWrzv4Y0ztmQR_C8FPP6SP8xLzjhaMWLvz7_ByF84SXtoK-fFMMHW4n3l4el_402Yjv5cSD-099nVBG2pshK9schph0VIqYVd1Ajkca9Ym-w2WYCM-IowxTCFcQkdD5phx_54GTx1uAlyJH5FPKm32hpWXac2SBNaLyHh-ZNDC2i413w5VlNubWAdDM74EWISLZGj87u-UAEBT49oehUW66EzD0p1wnZr8sRbKRfAPxxeiOvqgP0VE84pFYlAbA9'}")` }}></div>
                          <div>
                            <p className="font-bold text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          product.status === 'In Stock' ? 
                          'bg-green-100 text-green-700' : 
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">{product.price}</td>
                      <td className="px-6 py-4 text-right text-gray-500">{product.sold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Recent Activity Feed */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
            <div className="flex flex-col gap-6 relative">
              {/* Vertical Line */}
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-100"></div>
              {recentActivity.map((activity, index) => (
                <div key={activity.id} className="flex gap-4 relative">
                  <div className={`relative z-10 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0 shadow-sm ${
                    activity.type === 'order' ? 'bg-blue-100' : 
                    activity.type === 'payment' ? 'bg-green-100' : 
                    activity.type === 'warning' ? 'bg-yellow-100' : 
                    'bg-gray-100'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'order' ? 'bg-blue-500' : 
                      activity.type === 'payment' ? 'bg-green-500' : 
                      activity.type === 'warning' ? 'bg-yellow-500' : 
                      'bg-gray-500'
                    }`}></div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-gray-800"><span className="font-bold">{activity.action}</span> {activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-auto pt-6 w-full text-center text-sm font-semibold text-gray-600 hover:text-orange-500 transition-colors">
              View all activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;