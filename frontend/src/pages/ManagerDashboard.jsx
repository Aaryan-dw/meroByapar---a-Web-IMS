import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStore, FaUsers, FaChartLine, FaCog, FaBox,
  FaShoppingCart, FaEye, FaEdit, FaTrash,
  FaCheckCircle, FaTimesCircle, FaMoneyBillWave,
  FaPlus, FaUserTie, FaTruck, FaExclamationTriangle,
  FaUserCircle, FaSignOutAlt, FaTachometerAlt,
  FaTimes, FaSave, FaFileInvoiceDollar
} from "react-icons/fa";
import ThemeToggle from "../components/Common/ThemeToggle";

function ManagerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [modal, setModal] = useState({ type: null, data: null });
  const [formData, setFormData] = useState({});
  const [toast, setToast] = useState(null);

  const [stats] = useState({ totalProducts: 1250, lowStock: 23, totalSales: 456, todayRevenue: 45000, pendingOrders: 8, totalCustomers: 89 });

  const [products, setProducts] = useState([
    { id: 1, name: "Rice (5kg)", price: 450, stock: 125, category: "Groceries", status: "active", sales: 45 },
    { id: 2, name: "Cooking Oil", price: 220, stock: 8, category: "Groceries", status: "low", sales: 32 },
    { id: 3, name: "Smartphone", price: 15000, stock: 15, category: "Electronics", status: "active", sales: 12 },
    { id: 4, name: "T-Shirt", price: 800, stock: 45, category: "Clothing", status: "active", sales: 28 },
    { id: 5, name: "Paracetamol", price: 50, stock: 3, category: "Medical", status: "critical", sales: 67 },
    { id: 6, name: "Notebook", price: 60, stock: 120, category: "Stationery", status: "active", sales: 89 },
  ]);

  const [cashiers, setCashiers] = useState([
    { id: 1, name: "Rahul Kumar", email: "rahul@store.com", status: "active", shift: "Morning", sales: 45, lastActive: "2024-03-17" },
    { id: 2, name: "Priya Singh", email: "priya@store.com", status: "active", shift: "Evening", sales: 38, lastActive: "2024-03-17" },
    { id: 3, name: "Amit Sharma", email: "amit@store.com", status: "inactive", shift: "Morning", sales: 0, lastActive: "2024-03-15" },
  ]);

  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "Nepal Trading", contact: "9851234567", email: "info@nepaltrading.com", pendingOrders: 2, performance: "good" },
    { id: 2, name: "Kathmandu Distributors", contact: "9842345678", email: "info@ktmdistributors.com", pendingOrders: 1, performance: "excellent" },
    { id: 3, name: "Himalayan Supplies", contact: "9867890123", email: "info@himalayansupplies.com", pendingOrders: 3, performance: "average" },
  ]);

  const [recentSales] = useState([
    { id: 1, customer: "Walk-in Customer", items: 3, total: 1250, payment: "cash", time: "10:30 AM", cashier: "Rahul" },
    { id: 2, customer: "Ram Sharma", items: 5, total: 3450, payment: "card", time: "11:15 AM", cashier: "Priya" },
    { id: 3, customer: "Sita Devi", items: 2, total: 890, payment: "esewa", time: "12:00 PM", cashier: "Rahul" },
    { id: 4, customer: "Hari Bahadur", items: 8, total: 5670, payment: "cash", time: "01:30 PM", cashier: "Priya" },
  ]);

  const [pendingOrders, setPendingOrders] = useState([
    { id: 1000, items: 2, total: 1500, status: "pending" },
    { id: 1001, items: 4, total: 2000, status: "pending" },
    { id: 1002, items: 3, total: 2500, status: "pending" },
  ]);

  useEffect(() => {
    const checkDarkMode = () => setIsDark(document.documentElement.classList.contains("dark"));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    setTimeout(() => setLoading(false), 800);
    return () => observer.disconnect();
  }, []);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const handleLogout = () => { localStorage.removeItem("token"); sessionStorage.removeItem("token"); navigate("/login"); };
  const formatCurrency = (amount) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(amount);
  const openModal = (type, data = {}) => { setModal({ type, data }); setFormData({ ...data }); };
  const closeModal = () => { setModal({ type: null, data: null }); setFormData({}); };

  // Product actions
  const handleSaveProduct = () => {
    if (!formData.name || !formData.price) { showToast("Please fill required fields", "error"); return; }
    if (modal.type === "addProduct") {
      const status = formData.stock < 5 ? "critical" : formData.stock < 15 ? "low" : "active";
      setProducts(prev => [...prev, { ...formData, id: prev.length + 1, price: +formData.price, stock: +formData.stock, sales: 0, status }]);
      showToast("Product added!");
    } else {
      const status = formData.stock < 5 ? "critical" : formData.stock < 15 ? "low" : "active";
      setProducts(prev => prev.map(p => p.id === formData.id ? { ...p, ...formData, price: +formData.price, stock: +formData.stock, status } : p));
      showToast("Product updated!");
    }
    closeModal();
  };

  const handleDeleteProduct = () => {
    setProducts(prev => prev.filter(p => p.id !== modal.data.id));
    showToast("Product deleted!");
    closeModal();
  };

  // Cashier actions
  const handleSaveCashier = () => {
    if (!formData.name || !formData.email) { showToast("Please fill required fields", "error"); return; }
    if (modal.type === "addCashier") {
      setCashiers(prev => [...prev, { ...formData, id: prev.length + 1, status: "active", sales: 0, lastActive: new Date().toISOString().split("T")[0] }]);
      showToast("Cashier added!");
    } else {
      setCashiers(prev => prev.map(c => c.id === formData.id ? { ...c, ...formData } : c));
      showToast("Cashier updated!");
    }
    closeModal();
  };

  const handleDeleteCashier = () => {
    setCashiers(prev => prev.filter(c => c.id !== modal.data.id));
    showToast("Cashier removed!");
    closeModal();
  };

  // Supplier order
  const handlePlaceOrder = () => {
    setSuppliers(prev => prev.map(s => s.id === modal.data.id ? { ...s, pendingOrders: s.pendingOrders + 1 } : s));
    showToast(`Order placed with ${modal.data.name}!`);
    closeModal();
  };

  // Process pending order
  const handleProcessOrder = (orderId) => {
    setPendingOrders(prev => prev.filter(o => o.id !== orderId));
    showToast(`Order #${orderId} processed!`);
  };

  // Low stock view details
  const handleViewLowStock = () => setActiveTab("products");

  const c = (light, dark) => isDark ? dark : light;

  const s = {
    container: { display: "flex", minHeight: "100vh", backgroundColor: c("#f3f4f6", "#111827"), fontFamily: "'Segoe UI', sans-serif" },
    sidebar: { width: "260px", backgroundColor: c("white", "#1f2937"), borderRight: `1px solid ${c("#e5e7eb","#374151")}`, position: "fixed", height: "100vh", overflowY: "auto", zIndex: 10 },
    sidebarHeader: { padding: "24px", borderBottom: `1px solid ${c("#e5e7eb","#374151")}` },
    logo: { fontSize: "1.4rem", fontWeight: "800", color: c("#111827","white") },
    badge: { fontSize: "0.75rem", color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "2px 8px", borderRadius: "99px", marginTop: "6px", display: "inline-block" },
    navItem: (active) => ({ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", borderRadius: "8px", marginBottom: "3px", cursor: "pointer", backgroundColor: active ? (isDark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.08)") : "transparent", color: active ? "#10b981" : c("#6b7280","#9ca3af"), fontWeight: active ? "600" : "400", transition: "all 0.2s", fontSize: "0.9rem" }),
    main: { flex: 1, marginLeft: "260px", padding: "24px" },
    topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", backgroundColor: c("white","#1f2937"), borderRadius: "12px", marginBottom: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
    pageTitle: { fontSize: "1.3rem", fontWeight: "700", color: c("#111827","white") },
    userSection: { display: "flex", alignItems: "center", gap: "12px", position: "relative" },
    userInfo: { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", padding: "8px 12px", borderRadius: "8px", backgroundColor: c("#f3f4f6","#374151") },
    userMenu: { position: "absolute", top: "calc(100% + 8px)", right: 0, width: "180px", backgroundColor: c("white","#1f2937"), borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", border: `1px solid ${c("#e5e7eb","#374151")}`, zIndex: 50 },
    userMenuItem: (red) => ({ display: "flex", alignItems: "center", gap: "8px", padding: "11px 16px", cursor: "pointer", color: red ? "#ef4444" : c("#374151","#d1d5db"), fontSize: "0.875rem" }),
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: "16px", marginBottom: "24px" },
    statCard: (accent) => ({ backgroundColor: c("white","#1f2937"), padding: "20px", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", borderLeft: `4px solid ${accent}` }),
    tableWrap: { backgroundColor: c("white","#1f2937"), padding: "20px", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflowX: "auto", marginBottom: "20px" },
    th: { textAlign: "left", padding: "10px 12px", color: c("#6b7280","#9ca3af"), borderBottom: `1px solid ${c("#e5e7eb","#374151")}`, fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" },
    td: { padding: "12px", borderBottom: `1px solid ${c("#f3f4f6","#374151")}`, color: c("#374151","#d1d5db"), fontSize: "0.875rem" },
    statusBadge: (status) => {
      const map = { active: ["#10b981","rgba(16,185,129,0.1)"], good: ["#10b981","rgba(16,185,129,0.1)"], excellent: ["#10b981","rgba(16,185,129,0.1)"], low: ["#f59e0b","rgba(245,158,11,0.1)"], average: ["#f59e0b","rgba(245,158,11,0.1)"], critical: ["#ef4444","rgba(239,68,68,0.1)"], inactive: ["#ef4444","rgba(239,68,68,0.1)"], pending: ["#f59e0b","rgba(245,158,11,0.1)"] };
      const [color, bg] = map[status] || ["#6b7280","rgba(107,114,128,0.1)"];
      return { padding: "3px 10px", borderRadius: "99px", fontSize: "0.78rem", fontWeight: "600", backgroundColor: bg, color };
    },
    btn: (color, text="white") => ({ padding: "7px 14px", borderRadius: "7px", border: "none", cursor: "pointer", fontSize: "0.82rem", fontWeight: "600", backgroundColor: color, color: text, display: "inline-flex", alignItems: "center", gap: "5px" }),
    iconBtn: (bg, color) => ({ padding: "6px 10px", borderRadius: "6px", border: "none", cursor: "pointer", backgroundColor: isDark ? "#374151" : (bg||"#f3f4f6"), color: isDark ? "#d1d5db" : (color||"#374151"), display: "inline-flex", alignItems: "center" }),
    modal: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
    modalBox: (w="460px") => ({ backgroundColor: c("white","#1f2937"), borderRadius: "14px", width: w, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }),
    modalHeader: { padding: "20px 24px", borderBottom: `1px solid ${c("#e5e7eb","#374151")}`, display: "flex", justifyContent: "space-between", alignItems: "center" },
    modalTitle: { fontSize: "1.1rem", fontWeight: "700", color: c("#111827","white") },
    modalBody: { padding: "24px" },
    modalFooter: { padding: "16px 24px", borderTop: `1px solid ${c("#e5e7eb","#374151")}`, display: "flex", justifyContent: "flex-end", gap: "10px" },
    input: { width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1px solid ${c("#d1d5db","#4b5563")}`, backgroundColor: c("white","#374151"), color: c("#111827","white"), fontSize: "0.9rem", outline: "none", boxSizing: "border-box" },
    label: { fontSize: "0.82rem", fontWeight: "600", color: c("#374151","#d1d5db"), marginBottom: "5px", display: "block" },
    formGroup: { marginBottom: "14px" },
    select: { width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1px solid ${c("#d1d5db","#4b5563")}`, backgroundColor: c("white","#374151"), color: c("#111827","white"), fontSize: "0.9rem", outline: "none" },
    toast: (type) => ({ position: "fixed", bottom: "24px", right: "24px", padding: "12px 20px", borderRadius: "10px", backgroundColor: type === "success" ? "#10b981" : "#ef4444", color: "white", fontWeight: "600", fontSize: "0.9rem", zIndex: 2000, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", animation: "slideUp 0.3s ease" }),
    viewRow: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${c("#f3f4f6","#374151")}` },
    warning: { backgroundColor: isDark ? "rgba(245,158,11,0.1)" : "rgba(245,158,11,0.05)", border: "1px solid #f59e0b", borderRadius: "10px", padding: "16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" },
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { id: "products", label: "Products", icon: <FaBox /> },
    { id: "sales", label: "Sales", icon: <FaShoppingCart /> },
    { id: "cashiers", label: "Cashiers", icon: <FaUsers /> },
    { id: "suppliers", label: "Suppliers", icon: <FaTruck /> },
    { id: "reports", label: "Reports", icon: <FaChartLine /> },
  ];

  if (loading) return (
    <div style={{ ...s.container, justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 44, height: 44, border: "3px solid #e5e7eb", borderTopColor: "#10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        <p style={{ color: c("#6b7280","#9ca3af") }}>Loading dashboard...</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );

  return (
    <div style={s.container}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

      {toast && <div style={s.toast(toast.type)}>{toast.msg}</div>}

      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.sidebarHeader}>
          <div style={s.logo}>MeroByapar</div>
          <span style={s.badge}>Store Manager</span>
          <div style={{ fontSize: "0.8rem", color: c("#6b7280","#9ca3af"), marginTop: "4px" }}>Kirana Store</div>
        </div>
        <div style={{ padding: "12px" }}>
          {navItems.map(item => (
            <div key={item.id} style={s.navItem(activeTab === item.id)} onClick={() => setActiveTab(item.id)}>
              {item.icon} {item.label}
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${c("#e5e7eb","#374151")}`, margin: "12px 0", padding: "12px 0" }}>
            <div style={s.navItem(false)} onClick={() => setShowLogoutModal(true)}><FaSignOutAlt /> Logout</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={s.main}>
        <div style={s.topBar}>
          <h1 style={s.pageTitle}>{navItems.find(i => i.id === activeTab)?.label}</h1>
          <div style={s.userSection}>
            <ThemeToggle />
            <div style={s.userInfo} onClick={() => setShowUserMenu(!showUserMenu)}>
              <FaUserTie size={22} color="#10b981" />
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: "600", color: c("#111827","white") }}>Ram Sharma</div>
                <div style={{ fontSize: "0.72rem", color: c("#6b7280","#9ca3af") }}>Store Manager</div>
              </div>
            </div>
            {showUserMenu && (
              <div style={s.userMenu}>
                <div style={s.userMenuItem(true)} onClick={() => { setShowUserMenu(false); setShowLogoutModal(true); }}><FaSignOutAlt size={13} /> Logout</div>
              </div>
            )}
          </div>
        </div>

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div>
            {stats.lowStock > 0 && (
              <div style={s.warning}>
                <FaExclamationTriangle size={22} color="#f59e0b" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "700", color: c("#111827","white") }}>Low Stock Alert</div>
                  <div style={{ fontSize: "0.85rem", color: c("#6b7280","#9ca3af") }}>{stats.lowStock} products running low</div>
                </div>
                <button style={s.btn("#f59e0b")} onClick={handleViewLowStock}>View Details</button>
              </div>
            )}
            <div style={s.statsGrid}>
              {[
                { label: "Total Products", value: stats.totalProducts, icon: <FaBox size={32}/>, accent: "#3b82f6" },
                { label: "Today's Revenue", value: formatCurrency(stats.todayRevenue), icon: <FaMoneyBillWave size={32}/>, accent: "#10b981" },
                { label: "Total Sales", value: stats.totalSales, icon: <FaShoppingCart size={32}/>, accent: "#8b5cf6" },
                { label: "Customers", value: stats.totalCustomers, icon: <FaUsers size={32}/>, accent: "#f59e0b" },
              ].map((card, i) => (
                <div key={i} style={s.statCard(card.accent)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ color: c("#6b7280","#9ca3af"), fontSize: "0.8rem", marginBottom: "4px" }}>{card.label}</p>
                      <p style={{ fontSize: "1.5rem", fontWeight: "800", color: c("#111827","white") }}>{card.value}</p>
                    </div>
                    <div style={{ color: card.accent, opacity: 0.7 }}>{card.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Sales */}
            <div style={s.tableWrap}>
              <h3 style={{ fontWeight: "700", color: c("#111827","white"), marginBottom: "16px" }}>Recent Sales</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>{["Time","Customer","Items","Total","Payment","Cashier"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {recentSales.map(sale => (
                    <tr key={sale.id}>
                      <td style={s.td}>{sale.time}</td>
                      <td style={s.td}>{sale.customer}</td>
                      <td style={s.td}>{sale.items}</td>
                      <td style={{ ...s.td, fontWeight: "600", color: "#10b981" }}>{formatCurrency(sale.total)}</td>
                      <td style={s.td}><span style={{ padding: "2px 8px", borderRadius: "4px", backgroundColor: "rgba(59,130,246,0.1)", color: "#3b82f6", fontSize: "0.78rem" }}>{sale.payment}</span></td>
                      <td style={s.td}>{sale.cashier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Two columns */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div style={s.tableWrap}>
                <h3 style={{ fontWeight: "700", color: c("#111827","white"), marginBottom: "16px" }}>Active Cashiers</h3>
                {cashiers.filter(c => c.status === "active").map(cashier => (
                  <div key={cashier.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${isDark?"#374151":"#f3f4f6"}` }}>
                    <div>
                      <div style={{ fontWeight: "600", color: isDark?"white":"#111827" }}>{cashier.name}</div>
                      <div style={{ fontSize: "0.8rem", color: isDark?"#9ca3af":"#6b7280" }}>{cashier.shift} shift · {cashier.sales} sales</div>
                    </div>
                    <span style={s.statusBadge("active")}>Active</span>
                  </div>
                ))}
              </div>
              <div style={s.tableWrap}>
                <h3 style={{ fontWeight: "700", color: c("#111827","white"), marginBottom: "16px" }}>Pending Orders ({pendingOrders.length})</h3>
                {pendingOrders.length === 0 && <p style={{ color: c("#6b7280","#9ca3af"), textAlign: "center", padding: "20px" }}>No pending orders</p>}
                {pendingOrders.map(order => (
                  <div key={order.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${isDark?"#374151":"#f3f4f6"}` }}>
                    <div>
                      <div style={{ fontWeight: "600", color: isDark?"white":"#111827" }}>Order #{order.id}</div>
                      <div style={{ fontSize: "0.8rem", color: isDark?"#9ca3af":"#6b7280" }}>{order.items} items · {formatCurrency(order.total)}</div>
                    </div>
                    <button style={s.btn("#10b981")} onClick={() => handleProcessOrder(order.id)}>Process</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div style={s.tableWrap}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 style={{ fontWeight: "700", color: c("#111827","white") }}>Product Inventory ({products.length})</h3>
              <button style={s.btn("#10b981")} onClick={() => openModal("addProduct", { name:"", price:"", stock:"", category:"Groceries", status:"active" })}>
                <FaPlus size={11} /> Add Product
              </button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Product","Category","Price","Stock","Sales","Status","Actions"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td style={{ ...s.td, fontWeight: "600" }}>{product.name}</td>
                    <td style={s.td}>{product.category}</td>
                    <td style={s.td}>{formatCurrency(product.price)}</td>
                    <td style={s.td}><span style={{ fontWeight: product.stock < 10 ? "700" : "normal", color: product.stock < 5 ? "#ef4444" : product.stock < 15 ? "#f59e0b" : "inherit" }}>{product.stock}</span></td>
                    <td style={s.td}>{product.sales}</td>
                    <td style={s.td}><span style={s.statusBadge(product.status)}>{product.status}</span></td>
                    <td style={s.td}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button style={s.iconBtn()} title="View" onClick={() => openModal("viewProduct", product)}><FaEye size={12} /></button>
                        <button style={s.iconBtn()} title="Edit" onClick={() => openModal("editProduct", product)}><FaEdit size={12} /></button>
                        <button style={{ ...s.iconBtn(), backgroundColor: isDark ? "#7f1d1d" : "#fee2e2", color: "#ef4444" }} title="Delete" onClick={() => openModal("deleteProduct", product)}><FaTrash size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SALES TAB */}
        {activeTab === "sales" && (
          <div style={s.tableWrap}>
            <h3 style={{ fontWeight: "700", color: c("#111827","white"), marginBottom: "20px" }}>Sales History</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["#","Time","Customer","Items","Total","Payment","Cashier"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>
                {recentSales.map(sale => (
                  <tr key={sale.id}>
                    <td style={s.td}>#{sale.id}</td>
                    <td style={s.td}>{sale.time}</td>
                    <td style={s.td}>{sale.customer}</td>
                    <td style={s.td}>{sale.items}</td>
                    <td style={{ ...s.td, fontWeight: "700", color: "#10b981" }}>{formatCurrency(sale.total)}</td>
                    <td style={s.td}><span style={{ padding: "2px 8px", borderRadius: "4px", backgroundColor: "rgba(59,130,246,0.1)", color: "#3b82f6", fontSize: "0.78rem" }}>{sale.payment}</span></td>
                    <td style={s.td}>{sale.cashier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CASHIERS TAB */}
        {activeTab === "cashiers" && (
          <div style={s.tableWrap}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 style={{ fontWeight: "700", color: c("#111827","white") }}>Cashier Management ({cashiers.length})</h3>
              <button style={s.btn("#10b981")} onClick={() => openModal("addCashier", { name:"", email:"", shift:"Morning", status:"active" })}>
                <FaPlus size={11} /> Add Cashier
              </button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Name","Email","Shift","Today's Sales","Last Active","Status","Actions"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>
                {cashiers.map(cashier => (
                  <tr key={cashier.id}>
                    <td style={{ ...s.td, fontWeight: "600" }}>{cashier.name}</td>
                    <td style={s.td}>{cashier.email}</td>
                    <td style={s.td}>{cashier.shift}</td>
                    <td style={s.td}>{cashier.sales}</td>
                    <td style={s.td}>{cashier.lastActive}</td>
                    <td style={s.td}><span style={s.statusBadge(cashier.status)}>{cashier.status}</span></td>
                    <td style={s.td}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button style={s.iconBtn()} title="Edit" onClick={() => openModal("editCashier", cashier)}><FaEdit size={12} /></button>
                        <button style={s.iconBtn()} title="View" onClick={() => openModal("viewCashier", cashier)}><FaEye size={12} /></button>
                        <button style={{ ...s.iconBtn(), backgroundColor: isDark ? "#7f1d1d" : "#fee2e2", color: "#ef4444" }} title="Remove" onClick={() => openModal("deleteCashier", cashier)}><FaTrash size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SUPPLIERS TAB */}
        {activeTab === "suppliers" && (
          <div style={s.tableWrap}>
            <h3 style={{ fontWeight: "700", color: c("#111827","white"), marginBottom: "20px" }}>Supplier Management</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Supplier","Contact","Email","Pending Orders","Performance","Actions"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>
                {suppliers.map(supplier => (
                  <tr key={supplier.id}>
                    <td style={{ ...s.td, fontWeight: "600" }}>{supplier.name}</td>
                    <td style={s.td}>{supplier.contact}</td>
                    <td style={s.td}>{supplier.email}</td>
                    <td style={s.td}><span style={{ fontWeight: "600", color: supplier.pendingOrders > 2 ? "#f59e0b" : "inherit" }}>{supplier.pendingOrders}</span></td>
                    <td style={s.td}><span style={s.statusBadge(supplier.performance)}>{supplier.performance}</span></td>
                    <td style={s.td}>
                      <button style={s.btn("#10b981")} onClick={() => openModal("orderSupplier", supplier)}>
                        <FaTruck size={11} /> Place Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === "reports" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: "16px" }}>
            {[
              { title: "Sales Report", desc: "Today's and monthly sales summary", color: "#10b981" },
              { title: "Inventory Report", desc: "Stock levels and low stock alerts", color: "#3b82f6" },
              { title: "Cashier Performance", desc: "Individual cashier sales breakdown", color: "#8b5cf6" },
              { title: "Revenue Summary", desc: "Revenue trends and analysis", color: "#f59e0b" },
            ].map((report, i) => (
              <div key={i} style={{ ...s.tableWrap, borderLeft: `4px solid ${report.color}` }}>
                <div style={{ color: report.color, marginBottom: "8px" }}><FaChartLine size={24} /></div>
                <h4 style={{ fontWeight: "700", color: c("#111827","white"), marginBottom: "6px" }}>{report.title}</h4>
                <p style={{ fontSize: "0.85rem", color: c("#6b7280","#9ca3af"), marginBottom: "16px" }}>{report.desc}</p>
                <button style={s.btn(report.color)} onClick={() => {
                  const content = `${report.title}\n${report.desc}\nGenerated: ${new Date().toLocaleString()}`;
                  const blob = new Blob([content], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a"); a.href = url; a.download = `${report.title}.txt`; a.click();
                  showToast(`${report.title} downloaded!`);
                }}>Download Report</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== MODALS ===== */}

      {/* View Product */}
      {modal.type === "viewProduct" && (
        <div style={s.modal} onClick={closeModal}>
          <div style={s.modalBox()} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}><span style={s.modalTitle}>Product Details</span><button style={{ background:"none",border:"none",cursor:"pointer",color:c("#6b7280","#9ca3af") }} onClick={closeModal}><FaTimes /></button></div>
            <div style={s.modalBody}>
              {[["Name",modal.data.name],["Category",modal.data.category],["Price",formatCurrency(modal.data.price)],["Stock",modal.data.stock],["Sales",modal.data.sales],["Status",modal.data.status]].map(([k,v]) => (
                <div key={k} style={s.viewRow}><span style={{ color:c("#6b7280","#9ca3af"),fontSize:"0.85rem" }}>{k}</span><span style={{ color:c("#111827","white"),fontWeight:"600" }}>{v}</span></div>
              ))}
            </div>
            <div style={s.modalFooter}><button style={s.btn(c("#f3f4f6","#374151"),c("#374151","white"))} onClick={closeModal}>Close</button></div>
          </div>
        </div>
      )}

      {/* Add/Edit Product */}
      {(modal.type === "addProduct" || modal.type === "editProduct") && (
        <div style={s.modal} onClick={closeModal}>
          <div style={s.modalBox()} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}><span style={s.modalTitle}>{modal.type === "addProduct" ? "Add Product" : "Edit Product"}</span><button style={{ background:"none",border:"none",cursor:"pointer",color:c("#6b7280","#9ca3af") }} onClick={closeModal}><FaTimes /></button></div>
            <div style={s.modalBody}>
              {[["name","Product Name *","text"],["price","Price (Rs) *","number"],["stock","Stock Quantity *","number"]].map(([field,label,type]) => (
                <div key={field} style={s.formGroup}>
                  <label style={s.label}>{label}</label>
                  <input style={s.input} type={type} value={formData[field]||""} onChange={e => setFormData(p => ({...p,[field]:e.target.value}))} />
                </div>
              ))}
              <div style={s.formGroup}>
                <label style={s.label}>Category</label>
                <select style={s.select} value={formData.category||"Groceries"} onChange={e => setFormData(p => ({...p,category:e.target.value}))}>
                  {["Groceries","Electronics","Clothing","Medical","Stationery","Others"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={s.modalFooter}>
              <button style={s.btn(c("#f3f4f6","#374151"),c("#374151","white"))} onClick={closeModal}>Cancel</button>
              <button style={s.btn("#10b981")} onClick={handleSaveProduct}><FaSave size={12}/> {modal.type === "addProduct" ? "Add Product" : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Product */}
      {modal.type === "deleteProduct" && (
        <div style={s.modal} onClick={closeModal}>
          <div style={s.modalBox("380px")} onClick={e => e.stopPropagation()}>
            <div style={s.modalBody}>
              <div style={{ textAlign:"center" }}>
                <FaExclamationTriangle size={44} color="#ef4444" style={{ margin:"0 auto 16px" }} />
                <h3 style={{ fontWeight:"700",color:c("#111827","white"),marginBottom:"8px" }}>Delete Product?</h3>
                <p style={{ color:c("#6b7280","#9ca3af"),marginBottom:"24px" }}>Delete <strong style={{ color:c("#111827","white") }}>{modal.data?.name}</strong>? This cannot be undone.</p>
                <div style={{ display:"flex",gap:"10px" }}>
                  <button style={{ ...s.btn(c("#f3f4f6","#374151"),c("#374151","white")),flex:1,justifyContent:"center" }} onClick={closeModal}>Cancel</button>
                  <button style={{ ...s.btn("#ef4444"),flex:1,justifyContent:"center" }} onClick={handleDeleteProduct}><FaTrash size={11}/> Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Cashier */}
      {(modal.type === "addCashier" || modal.type === "editCashier") && (
        <div style={s.modal} onClick={closeModal}>
          <div style={s.modalBox()} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}><span style={s.modalTitle}>{modal.type === "addCashier" ? "Add Cashier" : "Edit Cashier"}</span><button style={{ background:"none",border:"none",cursor:"pointer",color:c("#6b7280","#9ca3af") }} onClick={closeModal}><FaTimes /></button></div>
            <div style={s.modalBody}>
              {[["name","Full Name *","text"],["email","Email *","email"]].map(([field,label,type]) => (
                <div key={field} style={s.formGroup}>
                  <label style={s.label}>{label}</label>
                  <input style={s.input} type={type} value={formData[field]||""} onChange={e => setFormData(p => ({...p,[field]:e.target.value}))} />
                </div>
              ))}
              <div style={s.formGroup}>
                <label style={s.label}>Shift</label>
                <select style={s.select} value={formData.shift||"Morning"} onChange={e => setFormData(p => ({...p,shift:e.target.value}))}>
                  <option>Morning</option><option>Evening</option><option>Night</option>
                </select>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Status</label>
                <select style={s.select} value={formData.status||"active"} onChange={e => setFormData(p => ({...p,status:e.target.value}))}>
                  <option value="active">Active</option><option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div style={s.modalFooter}>
              <button style={s.btn(c("#f3f4f6","#374151"),c("#374151","white"))} onClick={closeModal}>Cancel</button>
              <button style={s.btn("#10b981")} onClick={handleSaveCashier}><FaSave size={12}/> {modal.type === "addCashier" ? "Add Cashier" : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      {/* View Cashier */}
      {modal.type === "viewCashier" && (
        <div style={s.modal} onClick={closeModal}>
          <div style={s.modalBox()} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}><span style={s.modalTitle}>Cashier Details</span><button style={{ background:"none",border:"none",cursor:"pointer",color:c("#6b7280","#9ca3af") }} onClick={closeModal}><FaTimes /></button></div>
            <div style={s.modalBody}>
              {[["Name",modal.data.name],["Email",modal.data.email],["Shift",modal.data.shift],["Today's Sales",modal.data.sales],["Last Active",modal.data.lastActive],["Status",modal.data.status]].map(([k,v]) => (
                <div key={k} style={s.viewRow}><span style={{ color:c("#6b7280","#9ca3af"),fontSize:"0.85rem" }}>{k}</span><span style={{ color:c("#111827","white"),fontWeight:"600" }}>{v}</span></div>
              ))}
            </div>
            <div style={s.modalFooter}><button style={s.btn(c("#f3f4f6","#374151"),c("#374151","white"))} onClick={closeModal}>Close</button></div>
          </div>
        </div>
      )}

      {/* Delete Cashier */}
      {modal.type === "deleteCashier" && (
        <div style={s.modal} onClick={closeModal}>
          <div style={s.modalBox("380px")} onClick={e => e.stopPropagation()}>
            <div style={s.modalBody}>
              <div style={{ textAlign:"center" }}>
                <FaExclamationTriangle size={44} color="#ef4444" style={{ margin:"0 auto 16px" }} />
                <h3 style={{ fontWeight:"700",color:c("#111827","white"),marginBottom:"8px" }}>Remove Cashier?</h3>
                <p style={{ color:c("#6b7280","#9ca3af"),marginBottom:"24px" }}>Remove <strong style={{ color:c("#111827","white") }}>{modal.data?.name}</strong>?</p>
                <div style={{ display:"flex",gap:"10px" }}>
                  <button style={{ ...s.btn(c("#f3f4f6","#374151"),c("#374151","white")),flex:1,justifyContent:"center" }} onClick={closeModal}>Cancel</button>
                  <button style={{ ...s.btn("#ef4444"),flex:1,justifyContent:"center" }} onClick={handleDeleteCashier}>Remove</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Supplier */}
      {modal.type === "orderSupplier" && (
        <div style={s.modal} onClick={closeModal}>
          <div style={s.modalBox()} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}><span style={s.modalTitle}>Place Order</span><button style={{ background:"none",border:"none",cursor:"pointer",color:c("#6b7280","#9ca3af") }} onClick={closeModal}><FaTimes /></button></div>
            <div style={s.modalBody}>
              <p style={{ color:c("#6b7280","#9ca3af"),marginBottom:"16px" }}>Placing order with <strong style={{ color:c("#111827","white") }}>{modal.data?.name}</strong></p>
              <div style={s.formGroup}><label style={s.label}>Items to Order</label><input style={s.input} placeholder="e.g. Rice 50kg, Oil 20L" value={formData.items||""} onChange={e => setFormData(p => ({...p,items:e.target.value}))} /></div>
              <div style={s.formGroup}><label style={s.label}>Estimated Amount (Rs)</label><input style={s.input} type="number" value={formData.amount||""} onChange={e => setFormData(p => ({...p,amount:e.target.value}))} /></div>
              <div style={s.formGroup}><label style={s.label}>Notes</label><textarea style={{ ...s.input, minHeight:"80px", resize:"vertical" }} value={formData.notes||""} onChange={e => setFormData(p => ({...p,notes:e.target.value}))} /></div>
            </div>
            <div style={s.modalFooter}>
              <button style={s.btn(c("#f3f4f6","#374151"),c("#374151","white"))} onClick={closeModal}>Cancel</button>
              <button style={s.btn("#10b981")} onClick={handlePlaceOrder}><FaTruck size={12}/> Place Order</button>
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      {showLogoutModal && (
        <div style={s.modal} onClick={() => setShowLogoutModal(false)}>
          <div style={s.modalBox("360px")} onClick={e => e.stopPropagation()}>
            <div style={s.modalBody}>
              <div style={{ textAlign:"center" }}>
                <FaExclamationTriangle size={44} color="#f59e0b" style={{ margin:"0 auto 16px" }} />
                <h3 style={{ fontWeight:"700",color:c("#111827","white"),marginBottom:"8px" }}>Confirm Logout</h3>
                <p style={{ color:c("#6b7280","#9ca3af"),marginBottom:"24px" }}>Are you sure you want to logout?</p>
                <div style={{ display:"flex",gap:"10px" }}>
                  <button style={{ ...s.btn(c("#f3f4f6","#374151"),c("#374151","white")),flex:1,justifyContent:"center" }} onClick={() => setShowLogoutModal(false)}>Cancel</button>
                  <button style={{ ...s.btn("#ef4444"),flex:1,justifyContent:"center" }} onClick={handleLogout}><FaSignOutAlt size={12}/> Logout</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagerDashboard;
