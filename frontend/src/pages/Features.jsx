import { Link } from "react-router-dom";
import ThemeToggle from "../components/Common/ThemeToggle";
import Footer from "../components/Common/Footer";
import { 
  FaBox, 
  FaDatabase,
  FaShoppingCart, 
  FaChartLine, 
  FaUsers,
  FaTruck,
  FaBell,
  FaFileInvoice,
  FaShieldAlt,
  FaUserTie,
  FaUserCog,
  FaUserClock,
  FaCrown,
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
  FaStore,
  FaBarcode,
  FaTags,
  FaPercent,
  FaCalendarAlt,
  FaRegCreditCard,
  FaFilePdf,
  FaEnvelope,
  FaMobile,
  FaDesktop,
  FaCloud,
  FaLock,
  FaSync,
  FaSearch,
  FaFilter,
  FaSort,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaUndo,
  FaCheck,
  FaTimes,
  FaExclamation,
  FaInfoCircle,
  FaQuestionCircle,
  FaGift,
  FaMoneyBillWave,
  FaChartPie,
  FaLayerGroup,
  FaClipboardList,
  FaRegClock,
  FaRegBell,
  FaRegChartBar
} from "react-icons/fa";

function Features() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white transition-all duration-300">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-4 shadow-md bg-white dark:bg-black sticky top-0 z-50">
        <Link to="/" className="text-2xl font-bold hover:text-blue-600 transition">MeroByapar</Link>
        <div className="flex items-center gap-6">
          <Link
            to="/login"
            className="px-4 py-2 rounded bg-gray-800 text-white dark:bg-white dark:text-black"
          >
            Login
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Powerful Features for Your Business</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Everything you need to manage your store, inventory, billing, and team in one comprehensive platform
          </p>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* 1. Inventory Management */}
          <div id="inventory" className="mb-20 scroll-mt-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center">
                <FaBox className="text-3xl text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-4xl font-bold">🔎 Inventory Management</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard 
                icon={<FaSync className="text-2xl text-blue-600" />}
                title="Real-time Stock Tracking"
                description="Live updates on stock levels as sales happen. Never oversell or miss a sale."
                details={[
                  "Automatic stock deduction on sale",
                  "Real-time inventory counts",
                  "Multi-warehouse support",
                  "Stock transfer between locations"
                ]}
              />
              
              <FeatureCard 
                icon={<FaExclamationTriangle className="text-2xl text-yellow-600" />}
                title="Low Stock Alerts"
                description="Get notified when products are running low so you can reorder in time."
                details={[
                  "Customizable threshold levels",
                  "Email and in-app notifications",
                  "Bulk reorder suggestions",
                  "Auto-generated purchase orders"
                ]}
              />
              
              <FeatureCard 
                icon={<FaTags className="text-2xl text-purple-600" />}
                title="Product Categorization"
                description="Organize products with categories, tags, and custom fields."
                details={[
                  "Unlimited categories & subcategories",
                  "Product tags for easy filtering",
                  "Custom attributes (size, color, etc.)",
                  "Bulk category assignment"
                ]}
              />
              
              <FeatureCard 
                icon={<FaCalendarAlt className="text-2xl text-red-600" />}
                title="Batch & Expiry Tracking"
                description="Perfect for grocery, pharmacy, and perishable goods businesses."
                details={[
                  "Track by batch/lot numbers",
                  "Expiry date monitoring",
                  "FEFO (First Expiry First Out)",
                  "Expiry reports and alerts"
                ]}
              />
            </div>
          </div>

          {/* 2. Billing & Invoicing */}
          <div id="billing" className="mb-20 scroll-mt-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center">
                <FaFileInvoice className="text-3xl text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-4xl font-bold">🧾 Billing & Invoicing</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard 
                icon={<FaClock className="text-2xl text-green-600" />}
                title="Fast Bill Generation"
                description="Create bills in seconds with smart product search and auto-complete."
                details={[
                  "Barcode scanner support",
                  "Quick product search",
                  "Saved customer profiles",
                  "One-click repeat billing"
                ]}
              />
              
              <FeatureCard 
                icon={<FaWallet className="text-2xl text-blue-600" />}
                title="Multiple Payment Methods"
                description="Accept various payment types with ease."
                details={[
                  "Cash, Card, UPI, Mobile Payments",
                  "Split payments",
                  "Partial payments",
                  "Credit/Account sales"
                ]}
              />
              
              <FeatureCard 
                icon={<FaPrint className="text-2xl text-gray-600" />}
                title="Print-friendly Formats"
                description="Professional invoices that can be printed or shared digitally."
                details={[
                  "Multiple invoice templates",
                  "Thermal printer support",
                  "A4/Letter size formats",
                  "Logo and branding"
                ]}
              />
              
              <FeatureCard 
                icon={<FaPercent className="text-2xl text-orange-600" />}
                title="GST/VAT Calculation"
                description="Automatic tax calculation based on product and location."
                details={[
                  "Multi-tax rate support",
                  "Tax inclusive/exclusive pricing",
                  "Tax reports for filing",
                  "HSN/SAC code management"
                ]}
              />
            </div>

            {/* Additional Billing Features */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <MiniFeature icon={<FaFilePdf />} text="Digital invoice creation" />
              <MiniFeature icon={<FaEnvelope />} text="Email invoices to customers" />
              <MiniFeature icon={<FaUndo />} text="Easy returns & refunds" />
              <MiniFeature icon={<FaPercent />} text="Discount management" />
              <MiniFeature icon={<FaGift />} text="Loyalty points integration" />
              <MiniFeature icon={<FaRegCreditCard />} text="Payment gateway integration" />
            </div>
          </div>

          {/* 3. Analytics & Reports */}
          <div id="analytics" className="mb-20 scroll-mt-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center">
                <FaChartBar className="text-3xl text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-4xl font-bold">📊 Analytics & Reports</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard 
                icon={<FaMoneyBillWave className="text-2xl text-green-600" />}
                title="Real-time Profit/Loss"
                description="See your profitability at a glance with real-time calculations."
                details={[
                  "Gross profit margin",
                  "Net profit calculations",
                  "Cost of goods sold (COGS)",
                  "Profit by product/category"
                ]}
              />
              
              <FeatureCard 
                icon={<FaHistory className="text-2xl text-blue-600" />}
                title="Sales Reports"
                description="Comprehensive sales reports for any time period."
                details={[
                  "Daily, weekly, monthly, yearly",
                  "Custom date ranges",
                  "Sales by payment method",
                  "Sales by staff/cashier"
                ]}
              />
              
              <FeatureCard 
                icon={<FaStar className="text-2xl text-yellow-600" />}
                title="Top-selling Products"
                description="Identify your best performers and optimize your inventory."
                details={[
                  "Best sellers ranking",
                  "Slow movers report",
                  "Category performance",
                  "Seasonal trends"
                ]}
              />
              
              <FeatureCard 
                icon={<FaChartLine className="text-2xl text-purple-600" />}
                title="Revenue Trends"
                description="Visualize your business growth with trend analysis."
                details={[
                  "Growth charts",
                  "Year-over-year comparison",
                  "Forecasting tools",
                  "Peak hours analysis"
                ]}
              />
            </div>

            {/* Custom Reports */}
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <FaDownload className="text-2xl text-blue-600" />
                <h3 className="text-2xl font-semibold">Custom Report Generation</h3>
              </div>
              <p className="mb-4 opacity-80">Create personalized reports with the exact data you need.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <span className="px-3 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm">Export to Excel</span>
                <span className="px-3 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm">PDF Reports</span>
                <span className="px-3 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm">CSV Export</span>
                <span className="px-3 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm">Email Reports</span>
              </div>
            </div>
          </div>

          {/* 4. User Management */}
          <div id="users" className="mb-20 scroll-mt-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-2xl flex items-center justify-center">
                <FaUsers className="text-3xl text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-4xl font-bold">👥 User Management</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard 
                icon={<FaShieldAlt className="text-2xl text-blue-600" />}
                title="Role-Based Access Control"
                description="Define exactly what each user can see and do."
                details={[
                  "Admin, Manager, Cashier roles",
                  "Custom role creation",
                  "Permission matrix",
                  "Department-based access"
                ]}
              />
              
              <FeatureCard 
                icon={<FaLock className="text-2xl text-green-600" />}
                title="Secure Authentication"
                description="Multi-layered security to protect your data."
                details={[
                  "Password encryption",
                  "Two-factor authentication",
                  "Login attempt limits",
                  "Session management"
                ]}
              />
              
              <FeatureCard 
                icon={<FaHistory className="text-2xl text-purple-600" />}
                title="Activity Logging"
                description="Complete audit trail of all user actions."
                details={[
                  "User login history",
                  "Action logs (add, edit, delete)",
                  "IP address tracking",
                  "Compliance reports"
                ]}
              />
            </div>
          </div>

          {/* 5. Supplier Management */}
          <div id="suppliers" className="mb-20 scroll-mt-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-2xl flex items-center justify-center">
                <FaTruck className="text-3xl text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-4xl font-bold">👨‍💼 Supplier Management</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard 
                icon={<FaDatabase className="text-2xl text-blue-600" />}
                title="Supplier Database"
                description="Keep all supplier information in one place."
                details={[
                  "Contact details",
                  "Payment terms",
                  "Supplier categories",
                  "Document storage"
                ]}
              />
              
              <FeatureCard 
                icon={<FaClipboardList className="text-2xl text-green-600" />}
                title="Purchase Order Tracking"
                description="Manage orders from creation to delivery."
                details={[
                  "PO generation",
                  "Order status tracking",
                  "Partial deliveries",
                  "Order history"
                ]}
              />
              
              <FeatureCard 
                icon={<FaStar className="text-2xl text-yellow-600" />}
                title="Supplier Performance"
                description="Evaluate and compare your suppliers."
                details={[
                  "Delivery time tracking",
                  "Quality ratings",
                  "Price comparisons",
                  "Performance reports"
                ]}
              />
            </div>
          </div>

          {/* 6. Smart Notifications */}
          <div id="notifications" className="mb-20 scroll-mt-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-2xl flex items-center justify-center">
                <FaBell className="text-3xl text-yellow-600 dark:text-yellow-400" />
              </div>
              <h2 className="text-4xl font-bold">🔔 Smart Notifications</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard 
                icon={<FaExclamationTriangle className="text-2xl text-yellow-600" />}
                title="Low Stock Alerts"
                description="Never run out of popular items."
                details={[
                  "Email notifications",
                  "Dashboard alerts",
                  "SMS alerts (optional)",
                  "Auto reorder suggestions"
                ]}
              />
              
              <FeatureCard 
                icon={<FaClock className="text-2xl text-orange-600" />}
                title="Expiry Date Reminders"
                description="Reduce waste with timely expiry alerts."
                details={[
                  "30/15/7 day alerts",
                  "Expiry reports",
                  "Batch tracking",
                  "Markdown suggestions"
                ]}
              />
              
              <FeatureCard 
                icon={<FaFileAlt className="text-2xl text-blue-600" />}
                title="Daily Sales Summaries"
                description="Get daily performance updates."
                details={[
                  "End-of-day reports",
                  "Sales highlights",
                  "Low stock summary",
                  "Cash reconciliation"
                ]}
              />
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <p className="text-center">➕ System updates and important alerts delivered in real-time</p>
            </div>
          </div>

          {/* 7. Store Management */}
          <div id="store" className="mb-20 scroll-mt-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-2xl flex items-center justify-center">
                <FaStore className="text-3xl text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-4xl font-bold">🏪 Store Management</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard 
                icon={<FaPlus className="text-2xl text-green-600" />}
                title="Multi-store Support"
                description="Manage multiple locations from one dashboard."
                details={[
                  "Centralized control",
                  "Store-specific inventory",
                  "Cross-store transfers",
                  "Consolidated reports"
                ]}
              />
              
              <FeatureCard 
                icon={<FaCog className="text-2xl text-gray-600" />}
                title="Store Settings"
                description="Customize each store's configuration."
                details={[
                  "Business hours",
                  "Tax settings",
                  "Receipt templates",
                  "Payment methods"
                ]}
              />
              
              <FeatureCard 
                icon={<FaUsers className="text-2xl text-blue-600" />}
                title="Staff Management"
                description="Manage employees across locations."
                details={[
                  "Staff profiles",
                  "Schedule management",
                  "Performance tracking",
                  "Commission setup"
                ]}
              />
              
              <FeatureCard 
                icon={<FaChartPie className="text-2xl text-purple-600" />}
                title="Store Performance"
                description="Compare performance across locations."
                details={[
                  "Sales comparison",
                  "Profitability by store",
                  "Top performing stores",
                  "Growth metrics"
                ]}
              />
            </div>
          </div>

          {/* 8. Additional Features Grid */}
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-center mb-10">More Powerful Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <AdditionalFeature icon={<FaBarcode />} text="Barcode Support" />
              <AdditionalFeature icon={<FaMobile />} text="Mobile App" />
              <AdditionalFeature icon={<FaDesktop />} text="Desktop App" />
              <AdditionalFeature icon={<FaCloud />} text="Cloud Backup" />
              <AdditionalFeature icon={<FaSearch />} text="Advanced Search" />
              <AdditionalFeature icon={<FaFilter />} text="Smart Filters" />
              <AdditionalFeature icon={<FaSort />} text="Sort Options" />
              <AdditionalFeature icon={<FaEye />} text="Audit Trail" />
              <AdditionalFeature icon={<FaFileAlt />} text="Export Data" />
              <AdditionalFeature icon={<FaLock />} text="Data Security" />
              <AdditionalFeature icon={<FaSync />} text="Auto Sync" />
              <AdditionalFeature icon={<FaRegClock />} text="24/7 Support" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-4">Ready to Transform Your Business?</h3>
          <p className="text-xl mb-8 opacity-90">
            Get started with all these features today
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

// Feature Card Component
function FeatureCard({ icon, title, description, details }) {
  return (
    <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition group">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:scale-110 transition">
          {icon}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="opacity-80 mb-4 text-sm">{description}</p>
      <ul className="space-y-2">
        {details.map((detail, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
            <span>{detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Mini Feature Component
function MiniFeature({ icon, text }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="text-blue-600">{icon}</div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}

// Additional Feature Component
function AdditionalFeature({ icon, text }) {
  return (
    <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition text-center">
      <div className="text-2xl text-blue-600 mb-2">{icon}</div>
      <span className="text-xs font-medium">{text}</span>
    </div>
  );
}

export default Features;