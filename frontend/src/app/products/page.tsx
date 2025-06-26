"use client";

import { useState, Suspense } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_PRODUCTS, ADD_TO_CART, GET_CART } from '@/lib/queries';
import { ProductsData, Category } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { gql } from '@apollo/client';
import { useAuth } from '@/lib/auth';

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      _id
      name
    }
  }
`;

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const { data: productsData, loading: productsLoading } = useQuery<ProductsData>(GET_ALL_PRODUCTS, {
    variables: { 
      category: searchParams.get('category'), 
      search: searchParams.get('search') 
    }
  });

  const { data: categoriesData } = useQuery(GET_CATEGORIES);

  const [addToCart] = useMutation(ADD_TO_CART, {
    refetchQueries: [{ query: GET_CART }],
    onCompleted: () => {
      setAddingToCart(null);
      alert('Product added to cart!');
    },
    onError: (error) => {
      setAddingToCart(null);
      alert('Error adding to cart: ' + error.message);
    }
  });

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setAddingToCart(productId);    try {
      await addToCart({
        variables: {
          productId: productId,
          quantity: 1
        }
      });
    } catch {
      // Error handled by onError callback
    }
  };

  const products = productsData?.products || [];
  const categories = categoriesData?.categories || [];
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-first responsive layout */}
      <main className="container mx-auto py-4 px-4 sm:py-6 md:py-8 max-w-7xl">
        {/* Mobile header with title */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600 text-sm sm:text-base">Discover our wide range of technology products</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Mobile-optimized sidebar */}
          <aside className="w-full lg:w-64 order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Collapsible categories on mobile */}
              <details className="lg:!block" open>
                <summary className="lg:hidden p-4 cursor-pointer font-semibold text-gray-900 border-b border-gray-200 hover:bg-gray-50">
                  Categories <span className="float-right">▼</span>
                </summary>
                <div className="p-4 lg:pt-4">
                  <h2 className="hidden lg:block font-semibold mb-4 text-gray-900">Categories</h2>
                  <div className="space-y-1">
                    <Link
                      href="/products"
                      className="block py-2 px-3 text-sm text-gray-800 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      All Products
                    </Link>
                    {categories.map((cat: Category) => (
                      <Link
                        key={cat._id}
                        href={`/products?category=${cat._id}`}
                        className="block py-2 px-3 text-sm text-gray-800 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </details>
            </div>
          </aside>          {/* Main content area */}
          <div className="flex-1 order-1 lg:order-2">
            {/* Mobile-optimized search bar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6">
              <form className="p-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search products..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    defaultValue={searchParams.get('search') || ''}
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Products Grid - Mobile-first responsive */}
            {productsLoading ? (
              <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-3 text-gray-600 text-sm sm:text-base">Loading products...</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-600 text-base">No products found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
                  >
                    <Link href={`/products/${product._id}`}>
                      <div className="relative h-44 sm:h-48 cursor-pointer group">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <div className="text-center">
                              <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-gray-500 text-xs">No image</span>
                            </div>
                          </div>
                        )}
                        <div className="absolute top-2 left-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                            {product.category.name}
                          </span>
                        </div>
                      </div>
                    </Link>
                    
                    <div className="p-3 sm:p-4">
                      <Link href={`/products/${product._id}`}>
                        <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-2 leading-tight">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                      
                      {/* Price and stock - mobile optimized */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                        <span className="text-lg sm:text-xl font-bold text-blue-600">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.stock > 0 ? (
                          <span className="text-green-600 text-xs sm:text-sm font-medium">
                            In Stock: {product.stock}
                          </span>
                        ) : (
                          <span className="text-red-600 text-xs sm:text-sm font-medium">Out of Stock</span>
                        )}
                      </div>
                      
                      {/* Mobile-optimized buttons */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link
                          href={`/products/${product._id}`}
                          className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg text-center text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleAddToCart(product._id)}
                          disabled={product.stock === 0 || addingToCart === product._id}
                          className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {addingToCart === product._id ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Adding...
                            </span>
                          ) : product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>      </main>

      {/* Mobile-optimized Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 sm:py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            © 2025 Canada Computers. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}