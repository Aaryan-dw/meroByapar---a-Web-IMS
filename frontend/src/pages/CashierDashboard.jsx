import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingCart, FaBox, FaMoneyBillWave, FaUserCircle,
  FaSignOutAlt, FaCashRegister, FaPrint, FaPlus, FaMinus,
  FaTrash, FaCheckCircle, FaCreditCard, FaMobile,
  FaExclamationTriangle, FaTimes, FaReceipt, FaHistory
} from "react-icons/fa";
import ThemeToggle from "../components/Common/ThemeToggle";

function CashierDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pos");
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);
  const [toast, setToast] = useState(null);

  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customerName, setCustomerName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [productSearchQuery, setProductSearchQuery] = useState("");

  const [products, setProducts] = useState([
    { id: 1, name: "Rice (5kg)", price: 450, stock: 125, barcode: "890123456789", category: "Groceries" },
    { id: 2, name: "Cooking Oil (1L)", price: 220, stock: 8, barcode: "890123456790", category: "Groceries" },
    { id: 3, name: "Sugar (1kg)", price: 85, stock: 45, barcode: "890123456791", category: "Groceries" },
    { id: 4, name: "Tea (250g)", price: 120, stock: 32, barcode: "890123456792", category: "Beverages" },
    { id: 5, name: "Milk (1L)", price: 65, stock: 15, barcode: "890123456793", category: "Dairy" },
    { id: 6, name: "Bread", price: 45, stock: 22, barcode: "890123456794", category: "Bakery" },
    { id: 7, name: "Eggs (dozen)", price: 180, stock: 18, barcode: "890123456795", category: "Dairy" },
    { id: 8, name: "Biscuit Pack", price: 30, stock: 67, barcode: "890123456796", category: "Snacks" },
    { id: 9, name: "Noodles (5pk)", price: 95, stock: 40, barcode: "890123456797", category: "Snacks" },
    { id: 10, name: "Salt (1kg)", price: 25, stock: 80, barcode: "890123456798", category: "Groceries" },
  ]);

  const [salesHistory, setSalesHistory] = useState([
    { id: "TXN001", time: "09:15 AM", customer: "Walk-in", items: 3, subtotal: 635, tax: 82, total: 717, payment: "cash", cashier: "Rahul" },
    { id: "TXN002", time: "10:30 AM", customer: "Ram Sharma", items: 5, subtotal: 875, tax: 114, total: 989, payment: "card", cashier: "Rahul" },
    { id: "TXN003", time: "11:45 AM", customer: "Walk-in", items: 2, subtotal: 285, tax: 37, total: 322, payment: "esewa", cashier: "Rahul" },
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

  const filteredPOS = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.barcode.includes(searchQuery)
  );

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
    p.barcode.includes(productSearchQuery)
  );

  const addToCart = (product) => {
    if (product.stock <= 0) { showToast("Out of stock!", "error"); return; }
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) { showToast("Max stock reached!", "error"); return; }
      setCart(cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    showToast(`${product.name} added to cart`);
  };

  const updateQuantity = (id, delta) => {
    const item = cart.find(i => i.id === id);
    const product = products.find(p => p.id === id);
    if (!item || !product) return;
    const newQty = item.quantity + delta;
    if (newQty < 1) { setCart(cart.filter(i => i.id !== id)); return; }
    if (newQty > product.stock) { showToast("Not enough stock!", "error"); return; }
    setCart(cart.map(i => i.id === id ? { ...i, quantity: newQty } : i));
  };

  const removeFromCart = (id) => {
    const item = cart.find(i => i.id === id);
    setCart(cart.filter(i => i.id !== id));
    showToast(`${item?.name} removed`);
  };

  const clearCart = () => { setCart([]); showToast("Cart cleared"); };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.13);
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cart.length === 0) { showToast("Cart is empty!", "error"); return; }
    const txnId = "TXN" + String(salesHistory.length + 4).padStart(3, "0");
    const receipt = {
      id: txnId,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      customer: customerName.trim() || "Walk-in",
      items: cart.reduce((s, i) => s + i.quantity, 0),
      cartItems: [...cart],
      subtotal,
      tax,
      total,
      payment: paymentMethod,
      cashier: "Rahul",
    };
    // Deduct stock
    setProducts(prev => prev.map(p => {
      const cartItem = cart.find(i => i.id === p.id);
      return cartItem ? { ...p, stock: p.stock - cartItem.quantity } : p;
    }));
    setSalesHistory(prev => [receipt, ...prev]);
    setLastReceipt(receipt);
    setCart([]);
    setPaymentMethod("cash");
    setCustomerName("");
    setShowReceiptModal(true);
  };

  const handlePrintReceipt = () => {
    const receiptText = `
=============================
        MeroByapar
      Kirana Store
=============================
TXN ID: ${lastReceipt?.id}
Time: ${lastReceipt?.time}
Cashier: ${lastReceipt?.cashier}
-----------------------------
${lastReceipt?.cartItems?.map(i => `${i.name.padEnd(18)} x${i.quantity}  Rs${i.price * i.quantity}`).join("\n")}
-----------------------------
Subtotal:       Rs ${lastReceipt?.subtotal}
VAT (13%):      Rs ${lastReceipt?.tax}
TOTAL:          Rs ${lastReceipt?.total}
-----------------------------
Payment: ${lastReceipt?.payment.toUpperCase()}
=============================
     Thank you! Come again!
=============================
    `;
    const win = window.open("", "_blank");
    win.document.write(`<pre style="font-family:monospace;font-size:14px;">${receiptText}</pre>`);
    win.print();
    win.close();
  };

  const c = (light, dark) => isDark ? dark : light;

  const s = {
    container: { display: "flex", minHeight: "100vh", backgroundColor: c("#f3f4f6","#111827"), fontFamily: "'Segoe UI', sans-serif" },
    sidebar: { width: "240px", backgroundColor: c("white","#1f2937"), borderRight: `1px solid ${c("#e5e7eb","#374151")}`, position: "fixed", height: "100vh", overflowY: "auto", zIndex: 10 },
    sidebarHeader: { padding: "20px", borderBottom: `1px solid ${c("#e5e7eb","#374151")}` },
    logo: { fontSize: "1.3rem", fontWeight: "800", color: c("#111827","white") },
    badge: { fontSize: "0.72rem", color: "#8b5cf6", background: "rgba(139,92,246,0.1)", padding: "2px 8px", borderRadius: "99px", marginTop: "4px", display: "inline-block" },
    navItem: (active) => ({ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "8px", marginBottom: "3px", cursor: "pointer", backgroundColor: active ? (isDark ? "rgba(139,92,246,0.15)" : "rgba(139,92,246,0.08)") : "transparent", color: active ? "#8b5cf6" : c("#6b7280","#9ca3af"), fontWeight: active ? "600" : "400", transition: "all 0.2s", fontSize: "0.88rem" }),
    main: { flex: 1, marginLeft: "240px", padding: "20px" },
    topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", backgroundColor: c("white","#1f2937"), borderRadius: "12px", marginBottom: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
    pageTitle: { fontSize: "1.2rem", fontWeight: "700", color: c("#111827","white") },
    userSection: { display: "flex", alignItems: "center", gap: "12px", position: "relative" },
    userInfo: { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", padding: "7px 12px", borderRadius: "8px", backgroundColor: c("#f3f4f6","#374151") },
    userMenu: { position: "absolute", top: "calc(100% + 8px)", right: 0, width: "160px", backgroundColor: c("white","#1f2937"), borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", border: `1px solid ${c("#e5e7eb","#374151")}`, zIndex: 50 },
    posGrid: { display: "grid", gridTemplateColumns: "1fr 380px", gap: "20px" },
    panel: { backgroundColor: c("white","#1f2937"), padding: "20px", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" },
    searchBox: { width: "100%", padding: "11px 16px", borderRadius: "8px", border: `1px solid ${c("#d1d5db","#374151")}`, backgroundColor: c("#f9fafb","#374151"), color: c("#111827","white"), fontSize: "0.9rem", outline: "none", marginBottom: "16px", boxSizing: "border-box" },
    productGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: "10px" },
    productCard: (inStock) => ({ padding: "14px", borderRadius: "10px", backgroundColor: c("#f8fafc","#374151"), cursor: inStock ? "pointer" : "not-allowed", opacity: inStock ? 1 : 0.45, border: `1px solid ${c("#e5e7eb","#4b5563")}`, transition: "all 0.15s" }),
    cartItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${c("#f3f4f6","#374151")}` },
    qtyBtn: (color="#e5e7eb", text="#374151") => ({ width: "26px", height: "26px", borderRadius: "5px", border: "none", backgroundColor: isDark ? "#4b5563" : color, color: isDark ? "white" : text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }),
    paymentBtn: (active) => ({ flex: 1, padding: "10px 6px", borderRadius: "8px", border: "none", backgroundColor: active ? "#8b5cf6" : c("#f3f4f6","#374151"), color: active ? "white" : c("#6b7280","#9ca3af"), cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", fontSize: "0.75rem", fontWeight: active ? "700" : "400", transition: "all 0.2s" }),
    checkoutBtn: { width: "100%", padding: "14px", borderRadius: "10px", border: "none", backgroundColor: cart.length > 0 ? "#8b5cf6" : (isDark ? "#374151" : "#e5e7eb"), color: cart.length > 0 ? "white" : c("#9ca3af","#6b7280"), fontSize: "1rem", fontWeight: "700", cursor: cart.length > 0 ? "pointer" : "not-allowed", marginTop: "16px", transition: "all 0.2s" },
    modal: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
    modalBox: (w="420px") => ({ backgroundColor: c("white","#1f2937"), borderRadius: "14px", width: w, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }),
    modalHeader: { padding: "20px 24px", borderBottom: `1px solid ${c("#e5e7eb","#374151")}`, display: "flex", justifyContent: "space-between", alignItems: "center" },
    modalTitle: { fontSize: "1.1rem", fontWeight: "700", color: c("#111827","white") },
    modalBody: { padding: "24px" },
    modalFooter: { padding: "16px 24px", borderTop: `1px solid ${c("#e5e7eb","#374151")}`, display: "flex", justifyContent: "flex-end", gap: "10px" },
    btn: (color, text="white") => ({ padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600", backgroundColor: color, color: text, display: "inline-flex", alignItems: "center", gap: "6px" }),
    th: { textAlign: "left", padding: "10px 12px", color: c("#6b7280","#9ca3af"), borderBottom: `1px solid ${c("#e5e7eb","#374151")}`, fontSize: "0.78rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" },
    td: { padding: "12px", borderBottom: `1px solid ${c("#f3f4f6","#374151")}`, color: c("#374151","#d1d5db"), fontSize: "0.875rem" },
    toast: (type) => ({ position: "fixed", bottom: "24px", right: "24px", padding: "12px 20px", borderRadius: "10px", backgroundColor: type === "success" ? "#8b5cf6" : "#ef4444", color: "white", fontWeight: "600", fontSize: "0.9rem", zIndex: 2000, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", animation: "slideUp 0.3s ease" }),
    receiptRow: { display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "0.875rem" },
  };

  const navItems = [
    { id: "pos", label: "Point of Sale", icon: <FaCashRegister /> },
    { id: "products", label: "Products", icon: <FaBox /> },
    { id: "history", label: "Sales History", icon: <FaHistory /> },
  ];

  if (loading) return (
    <div style={{ ...s.container, justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 44, height: 44, border: "3px solid #e5e7eb", borderTopColor: "#8b5cf6", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        <p style={{ color: c("#6b7280","#9ca3af") }}>Loading POS...</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );

  return (
    <div style={s.container}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}} .product-card:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,0.1)}`}</style>

      {toast && <div style={s.toast(toast.type)}>{toast.msg}</div>}

      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.sidebarHeader}>
          <div style={s.logo}>MeroByapar</div>
          <span style={s.badge}>Cashier</span>
          <div style={{ fontSize: "0.78rem", color: c("#6b7280","#9ca3af"), marginTop: "4px" }}>Kirana Store</div>
        </div>
        <div style={{ padding: "10px" }}>
          {navItems.map(item => (
            <div key={item.id} style={s.navItem(activeTab === item.id)} onClick={() => setActiveTab(item.id)}>
              {item.icon} {item.label}
            </div>
          ))}
          {cart.length > 0 && activeTab !== "pos" && (
            <div style={{ margin: "10px 0", padding: "10px 14px", borderRadius: "8px", backgroundColor: "rgba(139,92,246,0.1)", cursor: "pointer" }} onClick={() => setActiveTab("pos")}>
              <span style={{ color: "#8b5cf6", fontWeight: "600", fontSize: "0.85rem" }}>🛒 {cart.length} item(s) in cart</span>
            </div>
          )}
          <div style={{ borderTop: `1px solid ${c("#e5e7eb","#374151")}`, margin: "10px 0", padding: "10px 0" }}>
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
              <FaUserCircle size={20} color="#8b5cf6" />
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: "600", color: c("#111827","white") }}>Rahul Kumar</div>
                <div style={{ fontSize: "0.7rem", color: c("#6b7280","#9ca3af") }}>Cashier</div>
              </div>
            </div>
            {showUserMenu && (
              <div style={s.userMenu}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"11px 16px", cursor:"pointer", color:"#ef4444", fontSize:"0.875rem" }} onClick={() => { setShowUserMenu(false); setShowLogoutModal(true); }}>
                  <FaSignOutAlt size={13} /> Logout
                </div>
              </div>
            )}
          </div>
        </div>

        {/* POS TAB */}
        {activeTab === "pos" && (
          <div style={s.posGrid}>
            {/* Products */}
            <div style={s.panel}>
              <h2 style={{ fontSize: "1rem", fontWeight: "700", color: c("#111827","white"), marginBottom: "14px" }}>
                🔍 Scan or Search Products
              </h2>
              <input
                type="text"
                placeholder="Search by name or barcode..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={s.searchBox}
              />
              <div style={s.productGrid}>
                {filteredPOS.map(product => (
                  <div
                    key={product.id}
                    className="product-card"
                    style={s.productCard(product.stock > 0)}
                    onClick={() => addToCart(product)}
                  >
                    <div style={{ fontSize: "0.8rem", color: c("#6b7280","#9ca3af"), marginBottom: "4px" }}>{product.category}</div>
                    <div style={{ fontWeight: "700", color: c("#111827","white"), fontSize: "0.9rem", marginBottom: "6px" }}>{product.name}</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#8b5cf6" }}>{formatCurrency(product.price)}</div>
                    <div style={{ fontSize: "0.75rem", color: product.stock < 5 ? "#ef4444" : product.stock < 15 ? "#f59e0b" : c("#9ca3af","#6b7280"), marginTop: "4px" }}>
                      {product.stock === 0 ? "Out of stock" : `Stock: ${product.stock}`}
                    </div>
                  </div>
                ))}
                {filteredPOS.length === 0 && (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px", color: c("#9ca3af","#6b7280") }}>
                    No products found
                  </div>
                )}
              </div>
            </div>

            {/* Cart */}
            <div style={{ ...s.panel, position: "sticky", top: "20px", alignSelf: "start" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: "700", color: c("#111827","white") }}>
                  🛒 Current Sale
                  {cart.length > 0 && <span style={{ marginLeft: "8px", fontSize: "0.78rem", color: "#8b5cf6", backgroundColor: "rgba(139,92,246,0.1)", padding: "2px 8px", borderRadius: "99px" }}>{cart.length}</span>}
                </h2>
                {cart.length > 0 && (
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "0.78rem", fontWeight: "600" }} onClick={clearCart}>Clear All</button>
                )}
              </div>

              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "36px 0", color: c("#9ca3af","#6b7280") }}>
                  <FaShoppingCart size={40} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
                  <p style={{ fontWeight: "600" }}>No items in cart</p>
                  <p style={{ fontSize: "0.82rem", marginTop: "4px" }}>Click products to add</p>
                </div>
              ) : (
                <>
                  <div style={{ maxHeight: "280px", overflowY: "auto" }}>
                    {cart.map(item => (
                      <div key={item.id} style={s.cartItem}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: "600", color: c("#111827","white"), fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                          <div style={{ fontSize: "0.78rem", color: c("#6b7280","#9ca3af") }}>{formatCurrency(item.price)} each</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginLeft: "8px" }}>
                          <button style={s.qtyBtn()} onClick={() => updateQuantity(item.id, -1)}><FaMinus size={9} /></button>
                          <span style={{ minWidth: "22px", textAlign: "center", fontSize: "0.85rem", fontWeight: "700", color: c("#111827","white") }}>{item.quantity}</span>
                          <button style={s.qtyBtn()} onClick={() => updateQuantity(item.id, 1)}><FaPlus size={9} /></button>
                          <button style={{ ...s.qtyBtn("#fee2e2","#ef4444"), marginLeft: "2px" }} onClick={() => removeFromCart(item.id)}><FaTrash size={9} /></button>
                        </div>
                        <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#8b5cf6", marginLeft: "10px", minWidth: "60px", textAlign: "right" }}>
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Name */}
                  <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: `1px solid ${c("#e5e7eb","#374151")}` }}>
                    <label style={{ fontSize: "0.78rem", fontWeight: "700", color: c("#6b7280","#9ca3af"), textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>
                      Customer Name
                    </label>
                    <input
                      type="text"
                      placeholder="Walk-in customer (optional)"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      style={{ ...s.searchBox, marginBottom: 0, padding: "9px 12px", fontSize: "0.88rem" }}
                    />
                  </div>

                  {/* Totals */}
                  <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: `1px solid ${c("#e5e7eb","#374151")}` }}>
                    {[["Subtotal", formatCurrency(subtotal)], ["VAT (13%)", formatCurrency(tax)]].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: c("#6b7280","#9ca3af"), fontSize: "0.85rem" }}>{k}</span>
                        <span style={{ color: c("#374151","#d1d5db"), fontSize: "0.85rem" }}>{v}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.15rem", fontWeight: "800", marginTop: "8px" }}>
                      <span style={{ color: c("#111827","white") }}>Total</span>
                      <span style={{ color: "#8b5cf6" }}>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
                    {[["cash", <FaMoneyBillWave size={16}/>, "Cash"], ["card", <FaCreditCard size={16}/>, "Card"], ["esewa", <FaMobile size={16}/>, "eSewa"]].map(([method, icon, label]) => (
                      <button key={method} style={s.paymentBtn(paymentMethod === method)} onClick={() => setPaymentMethod(method)}>
                        {icon}<span>{label}</span>
                      </button>
                    ))}
                  </div>

                  <button style={s.checkoutBtn} onClick={handleCheckout}>
                    ✓ Complete Sale · {formatCurrency(total)}
                  </button>
                  <p style={{ fontSize: "0.72rem", color: c("#9ca3af","#6b7280"), textAlign: "center", marginTop: "10px" }}>
                    ⚠️ Discounts require manager approval
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div style={s.panel}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: "700", color: c("#111827","white") }}>Product Catalog</h2>
              <span style={{ fontSize: "0.8rem", color: c("#6b7280","#9ca3af") }}>{products.length} products</span>
            </div>
            <input
              type="text"
              placeholder="Search products or barcode..."
              value={productSearchQuery}
              onChange={e => setProductSearchQuery(e.target.value)}
              style={s.searchBox}
            />
            <div style={s.productGrid}>
              {filteredProducts.map(product => (
                <div key={product.id} style={{ ...s.productCard(true), cursor: "default" }}>
                  <div style={{ fontSize: "0.75rem", color: c("#6b7280","#9ca3af"), marginBottom: "3px" }}>{product.category}</div>
                  <div style={{ fontWeight: "700", color: c("#111827","white"), fontSize: "0.88rem", marginBottom: "6px" }}>{product.name}</div>
                  <div style={{ fontSize: "1rem", fontWeight: "800", color: "#8b5cf6" }}>{formatCurrency(product.price)}</div>
                  <div style={{ fontSize: "0.72rem", color: product.stock < 5 ? "#ef4444" : product.stock < 15 ? "#f59e0b" : c("#9ca3af","#6b7280"), marginTop: "4px" }}>
                    Stock: {product.stock}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: c("#9ca3af","#6b7280"), marginTop: "3px" }}>
                    {product.barcode}
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "0.82rem", color: c("#9ca3af","#6b7280"), textAlign: "center", marginTop: "20px" }}>
              ℹ️ Contact your manager to update prices or inventory
            </p>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <div style={s.panel}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: "700", color: c("#111827","white") }}>Today's Sales History</h2>
              <div style={{ fontSize: "0.85rem", color: c("#6b7280","#9ca3af") }}>
                Total: <strong style={{ color: "#8b5cf6" }}>{formatCurrency(salesHistory.reduce((s, sale) => s + sale.total, 0))}</strong>
              </div>
            </div>
            {salesHistory.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", color: c("#9ca3af","#6b7280") }}>
                <FaReceipt size={40} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
                <p>No sales yet today</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>{["TXN ID","Time","Customer","Items","Subtotal","Tax","Total","Payment","Receipt"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {salesHistory.map(sale => (
                    <tr key={sale.id}>
                      <td style={{ ...s.td, fontWeight: "700", color: "#8b5cf6" }}>{sale.id}</td>
                      <td style={s.td}>{sale.time}</td>
                      <td style={s.td}>{sale.customer}</td>
                      <td style={s.td}>{sale.items}</td>
                      <td style={s.td}>{formatCurrency(sale.subtotal)}</td>
                      <td style={s.td}>{formatCurrency(sale.tax)}</td>
                      <td style={{ ...s.td, fontWeight: "700" }}>{formatCurrency(sale.total)}</td>
                      <td style={s.td}><span style={{ padding: "2px 8px", borderRadius: "4px", backgroundColor: "rgba(139,92,246,0.1)", color: "#8b5cf6", fontSize: "0.78rem" }}>{sale.payment}</span></td>
                      <td style={s.td}>
                        <button style={s.btn(c("#f3f4f6","#374151"),c("#374151","white"))} onClick={() => { setLastReceipt(sale); setShowReceiptModal(true); }}>
                          <FaReceipt size={11}/> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* RECEIPT MODAL */}
      {showReceiptModal && lastReceipt && (
        <div style={s.modal} onClick={() => setShowReceiptModal(false)}>
          <div style={s.modalBox("440px")} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <span style={s.modalTitle}>🧾 Receipt — {lastReceipt.id}</span>
              <button style={{ background:"none",border:"none",cursor:"pointer",color:c("#6b7280","#9ca3af") }} onClick={() => setShowReceiptModal(false)}><FaTimes /></button>
            </div>
            <div style={s.modalBody}>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <FaCheckCircle size={40} color="#10b981" style={{ margin: "0 auto 8px", display: "block" }} />
                <div style={{ fontWeight: "800", color: c("#111827","white"), fontSize: "1.1rem" }}>Sale Complete!</div>
                <div style={{ color: c("#6b7280","#9ca3af"), fontSize: "0.85rem" }}>{lastReceipt.time} · {lastReceipt.payment.toUpperCase()}</div>
              </div>
              <div style={{ backgroundColor: c("#f8fafc","#374151"), borderRadius: "10px", padding: "16px" }}>
                <div style={{ fontWeight: "700", color: c("#111827","white"), marginBottom: "12px", fontSize: "0.9rem" }}>Items Purchased</div>
                {lastReceipt.cartItems?.map(item => (
                  <div key={item.id} style={s.receiptRow}>
                    <span style={{ color: c("#374151","#d1d5db") }}>{item.name} × {item.quantity}</span>
                    <span style={{ color: c("#111827","white"), fontWeight: "600" }}>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div style={{ borderTop: `1px dashed ${c("#e5e7eb","#4b5563")}`, margin: "12px 0" }} />
                <div style={s.receiptRow}><span style={{ color: c("#6b7280","#9ca3af") }}>Subtotal</span><span style={{ color: c("#374151","#d1d5db") }}>{formatCurrency(lastReceipt.subtotal)}</span></div>
                <div style={s.receiptRow}><span style={{ color: c("#6b7280","#9ca3af") }}>VAT (13%)</span><span style={{ color: c("#374151","#d1d5db") }}>{formatCurrency(lastReceipt.tax)}</span></div>
                <div style={{ ...s.receiptRow, fontWeight: "800", fontSize: "1.05rem" }}>
                  <span style={{ color: c("#111827","white") }}>TOTAL</span>
                  <span style={{ color: "#8b5cf6" }}>{formatCurrency(lastReceipt.total)}</span>
                </div>
              </div>
            </div>
            <div style={s.modalFooter}>
              <button style={s.btn(c("#f3f4f6","#374151"),c("#374151","white"))} onClick={() => setShowReceiptModal(false)}>Close</button>
              <button style={s.btn("#8b5cf6")} onClick={handlePrintReceipt}><FaPrint size={12}/> Print Receipt</button>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div style={s.modal} onClick={() => setShowLogoutModal(false)}>
          <div style={s.modalBox("360px")} onClick={e => e.stopPropagation()}>
            <div style={s.modalBody}>
              <div style={{ textAlign: "center" }}>
                <FaExclamationTriangle size={44} color="#f59e0b" style={{ margin: "0 auto 16px" }} />
                <h3 style={{ fontWeight: "700", color: c("#111827","white"), marginBottom: "8px" }}>Confirm Logout</h3>
                {cart.length > 0 && <p style={{ color: "#ef4444", fontSize: "0.85rem", marginBottom: "8px" }}>⚠️ You have {cart.length} item(s) in cart that will be lost!</p>}
                <p style={{ color: c("#6b7280","#9ca3af"), marginBottom: "24px" }}>Are you sure you want to logout?</p>
                <div style={{ display: "flex", gap: "10px" }}>
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

export default CashierDashboard;
