import { Link } from "react-router-dom";
import ThemeToggle from "../components/Common/ThemeToggle";
import Footer from "../components/Common/Footer";
import heroImage from "../assets/mart.png";
import { 
  FaBox, 
  FaShoppingCart, 
  FaChartLine, 
  FaUsers,
  FaTruck,
  FaBell,
  FaFileInvoice,
  FaShieldAlt,
  FaUserTie,
  FaUserClock,
  FaCrown,
  FaArrowRight,
  FaCheckCircle,
  FaStar,
  FaClock,
  FaExclamationTriangle,
  FaFileAlt,
  FaPrint,
  FaWallet,
  FaHistory,
  FaChartBar,
  FaDownload,
  FaCog,
  FaStore
} from "react-icons/fa";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white transition-all duration-300">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-4 shadow-md bg-white dark:bg-black sticky top-0 z-50">
        <h1 className="text-2xl font-bold">MeroByapar</h1>
        <div className="flex items-center gap-6">
          <Link
            to="/login"
            className="px-4 py-2 rounded bg-gray-800 text-white dark:bg-white dark:text-black"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded bg-gray-800 text-white dark:bg-white dark:text-black"
          >
            Register
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section 
        className="h-[600px] flex items-center justify-center relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 text-white max-w-4xl">
          <h2 className="text-5xl font-bold mb-6">
            Complete Business Management Solution
          </h2>
          <p className="text-xl max-w-2xl mb-10 opacity-90">
            Inventory, Billing, Analytics, and User Management - All in One Platform
          </p>
          <div className="flex gap-6">
            <Link
              to="/register"
              className="px-8 py-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-lg font-semibold"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-lg border-2 border-white text-white hover:bg-white hover:text-black transition text-lg font-semibold"
            >
              Login
            </Link>
          </div>
          <p className="text-sm mt-6 opacity-80">Free account • No credit card required</p>
        </div>
      </section>

      {/* 2. KEY FEATURES OVERVIEW */}
      <section className="py-20 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Powerful Features for Your Business</h3>
            <p className="text-xl opacity-80 max-w-3xl mx-auto">
              Everything you need to manage your store efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Inventory Management */}
            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-xl transition group">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <FaBox className="text-2xl text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-xl font-semibold mb-3">🔎 Inventory Management</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Real-time stock tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaExclamationTriangle className="text-yellow-500 mt-1 flex-shrink-0" />
                  <span>Low stock alerts</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Product categorization</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaClock className="text-blue-500 mt-1 flex-shrink-0" />
                  <span>Batch & expiry tracking</span>
                </li>
              </ul>
            </div>

            {/* Billing & Invoicing */}
            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-xl transition group">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <FaFileInvoice className="text-2xl text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-xl font-semibold mb-3">🧾 Billing & Invoicing</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Fast bill generation</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaWallet className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Multiple payment methods</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaPrint className="text-blue-500 mt-1 flex-shrink-0" />
                  <span>Print-friendly formats</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaFileAlt className="text-purple-500 mt-1 flex-shrink-0" />
                  <span>GST/VAT calculation</span>
                </li>
              </ul>
            </div>

            {/* Analytics & Reports */}
            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-xl transition group">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <FaChartBar className="text-2xl text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-xl font-semibold mb-3">📊 Analytics & Reports</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Real-time profit/loss</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaHistory className="text-blue-500 mt-1 flex-shrink-0" />
                  <span>Daily/weekly/monthly reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaStar className="text-yellow-500 mt-1 flex-shrink-0" />
                  <span>Top-selling products</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaDownload className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Custom report generation</span>
                </li>
              </ul>
            </div>

            {/* User Management */}
            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-xl transition group">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <FaUsers className="text-2xl text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="text-xl font-semibold mb-3">👥 User Management</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li className="flex items-start gap-2">
                  <FaShieldAlt className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Role-based access control</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Secure authentication</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaHistory className="text-blue-500 mt-1 flex-shrink-0" />
                  <span>Activity logging</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Second Row of Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Supplier Management */}
            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-xl transition group">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <FaTruck className="text-2xl text-red-600 dark:text-red-400" />
              </div>
              <h4 className="text-xl font-semibold mb-3">👨‍💼 Supplier Management</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Supplier database</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaFileAlt className="text-blue-500 mt-1 flex-shrink-0" />
                  <span>Purchase order tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaStar className="text-yellow-500 mt-1 flex-shrink-0" />
                  <span>Supplier performance metrics</span>
                </li>
              </ul>
            </div>

            {/* Smart Notifications */}
            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-xl transition group">
              <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <FaBell className="text-2xl text-yellow-600 dark:text-yellow-400" />
              </div>
              <h4 className="text-xl font-semibold mb-3">🔔 Smart Notifications</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li className="flex items-start gap-2">
                  <FaExclamationTriangle className="text-yellow-500 mt-1 flex-shrink-0" />
                  <span>Low stock alerts</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaClock className="text-orange-500 mt-1 flex-shrink-0" />
                  <span>Expiry date reminders</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaFileAlt className="text-blue-500 mt-1 flex-shrink-0" />
                  <span>Daily sales summaries</span>
                </li>
              </ul>
            </div>

            {/* Store Management */}
            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-xl transition group">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <FaStore className="text-2xl text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="text-xl font-semibold mb-3">🏪 Store Management</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li className="flex items-start gap-2">
                  <FaCog className="text-blue-500 mt-1 flex-shrink-0" />
                  <span>Multi-store support</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaUsers className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Staff management</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaChartLine className="text-purple-500 mt-1 flex-shrink-0" />
                  <span>Store performance</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* View All Features Link */}
          <div className="text-center mt-12">
  <a 
    href="/features"
    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:gap-3 transition-all"
  >
    View All Features <FaArrowRight />
  </a>
</div>
        </div>
      </section>

      {/* 3. USER ROLES SECTION - SIMPLIFIED with only Admin, Manager, Cashier */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">👥 User Roles</h3>
            <p className="text-xl opacity-80">Three simple roles for complete access control</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Admin Role */}
            <div className="rounded-xl bg-gradient-to-b from-purple-500 to-purple-700 text-white p-8 shadow-xl">
              <FaCrown className="text-5xl mb-4" />
              <h4 className="text-2xl font-bold mb-4">Admin</h4>
              <p className="text-purple-100 mb-6">Full system access</p>
            </div>

            {/* Manager Role */}
            <div className="rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 text-white p-8 shadow-xl scale-105">
              <FaUserTie className="text-5xl mb-4" />
              <h4 className="text-2xl font-bold mb-4">Manager</h4>
              <p className="text-blue-100 mb-6">Store operations & staff management</p>
            </div>

            {/* Cashier Role */}
            <div className="rounded-xl bg-gradient-to-b from-green-500 to-green-700 text-white p-8 shadow-xl">
              <FaUserClock className="text-5xl mb-4" />
              <h4 className="text-2xl font-bold mb-4">Cashier</h4>
              <p className="text-green-100 mb-6">Billing & daily sales</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STATS SECTION */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="opacity-90">Active Stores</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="opacity-90">Products Managed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="opacity-90">Daily Transactions</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="opacity-90">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-4">Ready to Transform Your Business?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join 500+ businesses using MeroByapar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 rounded-lg bg-white text-blue-600 font-semibold hover:bg-gray-100 transition text-lg"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-lg border-2 border-white text-white hover:bg-white hover:text-blue-600 transition text-lg"
            >
              Login
            </Link>
          </div>
          <div className="flex justify-center gap-8 mt-8 text-sm">
            <span>✓ Free account</span>
            <span>✓ No credit card required</span>
            <span>✓ 24/7 support</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;