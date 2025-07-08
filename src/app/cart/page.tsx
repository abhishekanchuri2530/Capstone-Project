"use client";

import { useQuery, useMutation } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { GET_CART, UPDATE_CART_ITEM, REMOVE_FROM_CART } from '@/lib/queries';
import { useAuth } from '@/lib/auth';
import { useState } from 'react';
import { CartItem } from '@/types';

export default function CartPage() {
  const { user } = useAuth();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const { data, loading, refetch } = useQuery(GET_CART, {
    skip: !user,
    errorPolicy: 'ignore'
  });

  const [updateCartItem] = useMutation(UPDATE_CART_ITEM, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      alert('Error updating cart: ' + error.message);
    }
  });

  const [removeFromCart] = useMutation(REMOVE_FROM_CART, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      alert('Error removing from cart: ' + error.message);
    }
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view your cart.</p>
          <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  const cart = data?.cart;
  const cartItems = cart?.items || [];

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(productId));
    try {
      await updateCartItem({
        variables: { productId, quantity: newQuantity }
      });
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const removeItem = async (productId: string) => {
    setUpdatingItems(prev => new Set(prev).add(productId));
    try {
      await removeFromCart({
        variables: { productId }
      });
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };
  const totalAmount = cartItems.reduce((total: number, item: CartItem) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  const totalItems = cartItems.reduce((total: number, item: CartItem) => {
    return total + item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Start shopping to add items to your cart.</p>
            <Link href="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="lg:flex lg:gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Cart Items ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                  </h2>
                </div>
                  <div className="divide-y divide-gray-200">
                  {cartItems.map((item: CartItem) => (
                    <div key={item._id} className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-24 h-24">
                          {item.product.image_url ? (
                            <Image
                              src={item.product.image_url}
                              alt={item.product.name}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-500 text-xs">No image</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-6 flex-1">
                          <Link href={`/products/${item.product._id}`}>
                            <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="mt-1 text-sm text-gray-600">
                            ${item.product.price.toFixed(2)} each
                          </p>
                          <div className="mt-2 flex items-center">
                            <span className="text-sm text-gray-500 mr-2">Stock:</span>
                            <span className={`text-sm ${item.product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {item.product.stock > 0 ? `${item.product.stock} available` : 'Out of stock'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="ml-6 flex items-center space-x-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updatingItems.has(item.product._id)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              -
                            </button>
                            <span className="w-12 text-center font-medium">
                              {updatingItems.has(item.product._id) ? '...' : item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock || updatingItems.has(item.product._id)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              +
                            </button>
                          </div>
                          
                          {/* Item Total */}
                          <div className="text-lg font-semibold text-gray-900 w-24 text-right">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.product._id)}
                            disabled={updatingItems.has(item.product._id)}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3 mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${(totalAmount * 0.13).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                      <span>Total</span>
                      <span>${(totalAmount * 1.13).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => alert('Checkout functionality is a placeholder. Order processing would be implemented here.')}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Proceed to Checkout
                </button>
                
                <Link 
                  href="/products" 
                  className="block w-full text-center text-blue-600 py-3 px-4 mt-4 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
