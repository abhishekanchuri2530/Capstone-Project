export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <div className="font-bold text-lg text-gray-900">Canada Computers</div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#" className="hover:text-blue-600 text-gray-900">Home</a>
            <a href="#" className="hover:text-blue-600 text-gray-900">Products</a>
            <a href="#" className="hover:text-blue-600 text-gray-900">Laptops</a>
            <a href="#" className="hover:text-blue-600 text-gray-900">Desktops</a>
            <a href="#" className="hover:text-blue-600 text-gray-900">Accessories</a>
          </nav>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Search for a product..." className="border rounded px-2 py-1 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button className="p-1 text-gray-700 hover:text-blue-600"><span role="img" aria-label="search">🔍</span></button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-14 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Welcome to Canada Computers</h1>
        <p className="mb-7 text-lg font-medium">Your one-stop shop for top laptops, desktops, and accessories.</p>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-blue-700 px-7 py-2 rounded font-semibold hover:bg-blue-50 border border-blue-700 transition">Learn More</button>
          <button className="bg-blue-900 text-white px-7 py-2 rounded font-semibold hover:bg-blue-800 border border-blue-900 transition">Shop Now</button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto py-14 px-4">
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-3xl font-extrabold mb-2 text-gray-900">Featured Products</h2>
          <button className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 text-sm font-semibold shadow">View All Products</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Product Card 1 */}
          <div className="bg-white rounded-lg shadow-md p-5 flex flex-col border border-gray-200">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full w-max mb-2 font-semibold">New</span>
            <div className="bg-gray-200 h-32 rounded mb-4" />
            <div className="font-bold mb-1 text-gray-900">UltraBook Pro</div>
            <div className="text-gray-700 text-sm mb-2">High-performance laptop</div>
            <div className="font-bold text-blue-700">$1259</div>
          </div>
          {/* Product Card 2 */}
          <div className="bg-white rounded-lg shadow-md p-5 flex flex-col border border-gray-200">
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full w-max mb-2 font-semibold">Hot Sale</span>
            <div className="bg-gray-200 h-32 rounded mb-4" />
            <div className="font-bold mb-1 text-gray-900">Gamer&apos;s Choice 5X01</div>
            <div className="text-gray-700 text-sm mb-2">Gaming Desktop</div>
            <div className="font-bold text-red-700">$1999</div>
          </div>
          {/* Product Card 3 */}
          <div className="bg-white rounded-lg shadow-md p-5 flex flex-col border border-gray-200">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full w-max mb-2 font-semibold">Discount</span>
            <div className="bg-gray-200 h-32 rounded mb-4" />
            <div className="font-bold mb-1 text-gray-900">SoundMax Elite</div>
            <div className="text-gray-700 text-sm mb-2">Wireless Headphones</div>
            <div className="font-bold text-green-700">$299</div>
          </div>
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

