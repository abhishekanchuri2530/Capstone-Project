import { client } from '@/lib/apollo-client';
import { GET_FEATURED_PRODUCTS } from '@/lib/queries';
import { ProductsData } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = "force-dynamic";

async function getFeaturedProducts() {
  try {
    const { data } = await client.query<ProductsData>({
      query: GET_FEATURED_PRODUCTS,
    });
    return data.products;
  } catch {
    console.error('Error fetching featured products');
    return null;
  }
}

export default async function Home() {
  const products = await getFeaturedProducts();

  if (products === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Service Unavailable</h1>
        <p className="text-gray-700 mb-2">We are unable to load products at this time.</p>
        <p className="text-gray-500">Please try again later or check your connection to the backend server.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-14 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Welcome to Canada Computers</h1>
        <p className="mb-7 text-lg font-medium">Your one-stop shop for top laptops, desktops, and accessories.</p>
        <div className="flex justify-center gap-4">
          <Link href="/about" className="bg-white text-blue-700 px-7 py-2 rounded font-semibold hover:bg-blue-50 border border-blue-700 transition">
            Learn More
          </Link>
          <Link href="/products" className="bg-blue-900 text-white px-7 py-2 rounded font-semibold hover:bg-blue-800 border border-blue-900 transition">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto py-14 px-4">
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-3xl font-extrabold mb-2 text-gray-900">Featured Products</h2>
          <Link href="/products" className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 text-sm font-semibold shadow">
            View All Products
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link key={product._id} href={`/products/${product._id}`}>
              <div className="bg-white rounded-lg shadow-md p-5 flex flex-col border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full w-max mb-2 font-semibold">
                  {product.category.name}
                </span>
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="rounded mb-4 object-cover w-full h-32 hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="bg-gray-200 h-32 rounded mb-4" />
                )}
                <h3 className="font-bold mb-1 text-gray-900 hover:text-blue-600">{product.name}</h3>
                <p className="text-gray-700 text-sm mb-2">{product.description}</p>
                <div className="font-bold text-blue-700">${product.price.toFixed(2)}</div>
                {product.stock > 0 ? (
                  <span className="text-xs text-green-600 mt-1">In Stock: {product.stock}</span>
                ) : (
                  <span className="text-xs text-red-600 mt-1">Out of Stock</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-14 border-t border-b border-gray-200">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <h2 className="text-3xl font-extrabold mb-2 text-gray-900">Why Choose Us?</h2>
          <p className="mb-6 text-center text-gray-700 text-lg">Discover the benefits of shopping with Canada Computers.</p>
          <div className="flex gap-4 mb-8">
            <button className="bg-white border border-blue-700 text-blue-700 px-6 py-2 rounded hover:bg-blue-50 text-sm font-semibold">Contact Us</button>
            <button className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 text-sm font-semibold">Read More</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
            <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-lg shadow border border-gray-200">
              <div className="bg-blue-100 w-14 h-14 rounded flex items-center justify-center text-blue-700 text-2xl font-bold">✓</div>
              <div>
                <div className="font-semibold text-gray-900">Quality Assurance</div>
                <div className="text-gray-700 text-sm">We guarantee top-quality products and services.</div>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-lg shadow border border-gray-200">
              <div className="bg-blue-100 w-14 h-14 rounded flex items-center justify-center text-blue-700 text-2xl font-bold">💬</div>
              <div>
                <div className="font-semibold text-gray-900">Customer Support</div>
                <div className="text-gray-700 text-sm">24/7 support to help you with your needs.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner / Newsletter */}
      <section className="container mx-auto py-14 px-4">
        <div className="bg-blue-50 h-40 rounded flex items-center justify-center text-blue-700 text-lg font-semibold border border-blue-100 shadow">
          Subscribe to our newsletter and get the latest offers to your inbox!
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="bg-white py-14 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-extrabold mb-8 text-gray-900">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Review 1 */}
            <div className="bg-gray-50 p-7 rounded-lg shadow border border-gray-200 flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-200 w-12 h-12 rounded-full flex items-center justify-center text-blue-700 text-xl font-bold">JD</div>
                <div>
                  <div className="font-semibold text-gray-900">John Doe</div>
                  <div className="text-yellow-500 text-sm">★★★★★</div>
                </div>
              </div>
              <div className="text-gray-700 text-base">Great selection and service!</div>
            </div>
            {/* Review 2 */}
            <div className="bg-gray-50 p-7 rounded-lg shadow border border-gray-200 flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-200 w-12 h-12 rounded-full flex items-center justify-center text-blue-700 text-xl font-bold">JS</div>
                <div>
                  <div className="font-semibold text-gray-900">Jane Smith</div>
                  <div className="text-yellow-500 text-sm">★★★★★</div>
                </div>
              </div>
              <div className="text-gray-700 text-base">I love my new laptop. Thanks Canada Computers!</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-6 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <div>©2025 Canada Computers. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <span>Follow us on Facebook, Twitter, Instagram</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

