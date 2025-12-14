import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-8 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-bold text-gray-800">Get to Know Us</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a className="text-gray-600 hover:text-gray-800 hover:underline" href="#">About Us</a></li>
              <li><a className="text-gray-600 hover:text-gray-800 hover:underline" href="#">Careers</a></li>
              <li><a className="text-gray-600 hover:text-gray-800 hover:underline" href="#">Press Releases</a></li>
              <li><a className="text-gray-600 hover:text-gray-800 hover:underline" href="#">Shopazon Science</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Make Money with Us</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a className="text-gray-600 hover:text-gray-800 hover:underline" href="#">Sell on Shopazon</a></li>
              <li><a className="text-gray-600 hover:text-gray-800 hover:underline" href="#">Sell on Shopazon Business</a></li>
              <li><a className="text-gray-600 hover:text-gray-800 hover:underline" href="#">Associates Program</a></li>
              <li><a className="text-gray-600 hover:text-gray-800 hover:underline" href="#">Advertise Your Products</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Payment Products</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a className="text-gray-600 hover:text-gray-800 hover:underline" href="#">Shopazon Rewards Visa</a></li>
              <li><a className="text-gray-600 hover:text-gray-800 hover:underline" href="#">Shopazon.com Store Card</a></li>
              <li><a className="text-gray-600 hover:text-gray-800 hover:underline" href="#">Shop with Points</a></li>
              <li><a className="text-gray-600 hover:text-gray-800 hover:underline" href="#">Reload Your Balance</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Let Us Help You</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a className="text-gray-600 hover:text-gray-800 hover:underline" href="#">Your Account</a></li>
              <li><a className="text-gray-600 hover:text-gray-800 hover:underline" href="#">Your Orders</a></li>
              <li><a className="text-gray-600 hover:text-gray-800 hover:underline" href="#">Shipping Rates & Policies</a></li>
              <li><a className="text-gray-600 hover:text-gray-800 hover:underline" href="#">Returns & Replacements</a></li>
              <li><a className="text-gray-600 hover:text-gray-800 hover:underline" href="#">Help</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
          <p>© 2023, Shopazon.com, Inc. or its affiliates</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;