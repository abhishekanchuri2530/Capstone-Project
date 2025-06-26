"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth';
import { useQuery } from '@apollo/client';
import { GET_CART } from '@/lib/queries';
import { CartItem } from '@/types';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const { data: cartData } = useQuery(GET_CART, {
    skip: !user,
    errorPolicy: 'ignore'
  });

  const cartItemsCount = cartData?.cart?.items?.reduce((total: number, item: CartItem) => total + item.quantity, 0) || 0;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navigation Bar */}
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image 
              src="/Logo.svg" 
              alt="Canada Computers Logo" 
              width={120} 
              height={32}
              className="h-8 w-auto sm:h-10 lg:h-12"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-gray-900 hover:text-blue-600 transition-colors duration-200 font-medium">
              Home
            </Link>
            <Link href="/products" className="text-gray-900 hover:text-blue-600 transition-colors duration-200 font-medium">
              Products
            </Link>
          </nav>
          
          {/* Desktop Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Search for a product..." 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                🔍
              </button>
            </div>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile Search Toggle */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              🔍
            </button>
            
            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">
              🛒
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </span>
              )}
            </Link>
            
            {/* User Actions */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-900 hover:text-blue-600 transition-colors duration-200 p-2">
                  <span className="hidden sm:inline text-sm font-medium">Hi, {user.name}</span>
                  <span className="sm:hidden">👤</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link href="/profile" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                    Profile
                  </Link>
                  <Link href="/orders" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                    Orders
                  </Link>
                  <hr className="border-gray-200" />
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <Link href="/login" className="text-sm text-gray-900 hover:text-blue-600 transition-colors duration-200 px-3 py-2 font-medium">
                  Login
                </Link>
                <span className="text-gray-400 hidden sm:inline">|</span>
                <Link href="/register" className="text-sm text-gray-900 hover:text-blue-600 transition-colors duration-200 px-3 py-2 font-medium">
                  Register
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
                <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
              </div>
            </button>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search for a product..." 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                🔍
              </button>
            </div>
          </div>
        )}
        
        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="text-gray-900 hover:text-blue-600 transition-colors duration-200 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className="text-gray-900 hover:text-blue-600 transition-colors duration-200 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
