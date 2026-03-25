import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaStore, FaUsers, FaCog, FaMoneyBillWave,
  FaEye, FaEdit, FaTrash, FaCheckCircle,
  FaDownload, FaPlus, FaUserCircle, FaSignOutAlt,
  FaTachometerAlt, FaFileAlt, FaExclamationTriangle,
  FaTimes, FaSave, FaClock, FaKey, FaLock
} from "react-icons/fa";
import ThemeToggle from "../components/Common/ThemeToggle";

const API = "http://localhost:5000/api";
const getAuthHeader = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [modal, setModal] = useState({ type: null, data: null });
  const [formData, setFormData] = useState({});
  const [toast, setToast] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [settingsData, setSettingsData] = useState({ systemName: "MeroByapar", adminEmail: "", sessionTimeout: 30 });

  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    const style = document.createElement("style");
    style.textContent = `@keyframes spin{to{transform:rotate(360deg)}} @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`;
    document.head.appendChild(style);
    fetchAll();
    setSettingsData(p => ({ ...p, adminEmail: currentUser.email || "" }));
    return () => { obs.disconnect(); document.head.removeChild(style); };
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchStores(), fetchUsers()]);
    setLoading(false);
  };

  const fetchStores = async () => {
    try {
      const res = await axios.get(`${API}/store`, { headers: getAuthHeader() });
      setStores(res.data.data || []);
    } catch { showToast("Failed to load stores", "error"); }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/users`, { headers: getAuthHeader() });
      setUsers(res.data.data || []);
    } catch { showToast("Failed to load users", "error"); }
  };

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };
  const handleLogout = () => { localStorage.clear(); sessionStorage.clear(); navigate("/login"); };
  const openModal = (type, data = {}) => { setModal({ type, data }); setFormData({ ...data }); };
  const closeModal = () => { setModal({ type: null, data: null }); setFormData({}); };

  // ── STORE ACTIONS ──────────────────────────────────────────────────────
  const handleSaveStore = async () => {
    if (!formData.store_name || !formData.store_owner || !formData.phone || !formData.address) {
      showToast("Please fill all required fields", "error"); return;
    }
    setApiLoading(true);
    try {
      if (modal.type === "addStore") {
        await axios.post(`${API}/store`, formData, { headers: getAuthHeader() });
        showToast("Store added successfully!");
      } else {
        await axios.put(`${API}/store/${formData._id}`, formData, { headers: getAuthHeader() });
        showToast("Store updated!");
      }
      await fetchStores(); closeModal();
    } catch (err) { showToast(err.response?.data?.error || "Failed to save store", "error"); }
    finally { setApiLoading(false); }
  };

  const handleDeleteStore = async () => {
    setApiLoading(true);
    try {
      await axios.delete(`${API}/store/${modal.data._id}`, { headers: getAuthHeader() });
      showToast("Store deleted!"); await fetchStores(); closeModal();
    } catch (err) { showToast(err.response?.data?.error || "Failed to delete", "error"); }
    finally { setApiLoading(false); }
  };

  // ── USER ACTIONS ───────────────────────────────────────────────────────
  const handleAssignRole = async () => {
    if (!formData.role || formData.role === "pending") { showToast("Please select a valid role", "error"); return; }
    setApiLoading(true);
    try {
      await axios.put(`${API}/user/${formData._id}`, {
        role: formData.role,
        ...(formData.store_id && { store_id: formData.store_id }),
        isActive: true,
      }, { headers: getAuthHeader() });
      showToast(`Role assigned: ${formData.role}`);
      await fetchUsers(); closeModal();
    } catch (err) { showToast(err.response?.data?.error || "Failed to assign role", "error"); }
    finally { setApiLoading(false); }
  };

  const handleToggleActive = async (user) => {
    try {
      await axios.put(`${API}/user/${user._id}`, { isActive: !user.isActive }, { headers: getAuthHeader() });
      showToast(`User ${!user.isActive ? "activated" : "deactivated"}!`);
      await fetchUsers();
    } catch { showToast("Failed to update user", "error"); }
  };

  const handleDeleteUser = async () => {
    setApiLoading(true);
    try {
      await axios.delete(`${API}/user/${modal.data._id}`, { headers: getAuthHeader() });
      showToast("User deleted!"); await fetchUsers(); closeModal();
    } catch (err) { showToast(err.response?.data?.error || "Failed to delete", "error"); }
    finally { setApiLoading(false); }
  };

  const handleChangePassword = async () => {
    if (!formData.newPassword) { showToast("Please enter a new password", "error"); return; }
    if (formData.newPassword.length < 6) { showToast("Password must be at least 6 characters", "error"); return; }
    if (formData.newPassword !== formData.confirmPassword) { showToast("Passwords do not match", "error"); return; }
    setApiLoading(true);
    try {
      await axios.put(`${API}/user/${formData._id}`, { password: formData.newPassword }, { headers: getAuthHeader() });
      showToast(`Password changed for ${formData.name}!`);
      closeModal();
    } catch (err) { showToast(err.response?.data?.error || "Failed to change password", "error"); }
    finally { setApiLoading(false); }
  };

  const handleDownload = (report) => {
    const blob = new Blob([`${report.name}\nDate: ${new Date().toLocaleDateString()}\nGenerated by MeroByapar`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${report.name}.txt`; a.click();
    URL.revokeObjectURL(url);
    showToast(`${report.name} downloaded!`);
  };

  const pendingUsers = users.filter(u => u.role === "pending");
  const activeStores = stores.filter(s => s.isActive !== false).length;

  const reports = [
    { id: 1, name: "Monthly Sales Report", date: "March 2026", type: "sales", size: "2.5 MB", downloads: 45 },
    { id: 2, name: "Inventory Summary", date: "March 2026", type: "inventory", size: "1.8 MB", downloads: 32 },
    { id: 3, name: "User Activity Log", date: "March 2026", type: "users", size: "3.2 MB", downloads: 28 },
    { id: 4, name: "Revenue Analysis", date: "Q1 2026", type: "revenue", size: "4.1 MB", downloads: 56 },
  ];

  const c = (light, dark) => isDark ? dark : light;
  const s = {
    container: { display: "flex", minHeight: "100vh", backgroundColor: c("#f3f4f6","#111827"), fontFamily: "'Segoe UI', sans-serif" },
    sidebar: { width: "260px", backgroundColor: c("white","#1f2937"), borderRight: `1px solid ${c("#e5e7eb","#374151")}`, position: "fixed", height: "100vh", overflowY: "auto", zIndex: 10 },
    navItem: (active) => ({ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", borderRadius: "8px", marginBottom: "3px", cursor: "pointer", backgroundColor: active ? (isDark?"rgba(59,130,246,0.2)":"rgba(59,130,246,0.08)") : "transparent", color: active ? "#3b82f6" : c("#6b7280","#9ca3af"), fontWeight: active ? "600" : "400", transition: "all 0.2s", fontSize: "0.9rem" }),
    main: { flex: 1, marginLeft: "260px", padding: "24px" },
    topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", backgroundColor: c("white","#1f2937"), borderRadius: "12px", marginBottom: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
    userSection: { display: "flex", alignItems: "center", gap: "12px", position: "relative" },
    userInfo: { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", padding: "8px 12px", borderRadius: "8px", backgroundColor: c("#f3f4f6","#374151") },
    userMenu: { position: "absolute", top: "calc(100% + 8px)", right: 0, width: "180px", backgroundColor: c("white","#1f2937"), borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", border: `1px solid ${c("#e5e7eb","#374151")}`, zIndex: 50 },
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "16px", marginBottom: "24px" },
    statCard: (accent) => ({ backgroundColor: c("white","#1f2937"), padding: "20px", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", borderLeft: `4px solid ${accent}` }),
    tableWrap: { backgroundColor: c("white","#1f2937"), padding: "20px", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflowX: "auto", marginBottom: "20px" },
    th: { textAlign: "left", padding: "10px 12px", color: c("#6b7280","#9ca3af"), borderBottom: `1px solid ${c("#e5e7eb","#374151")}`, fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em" },
    td: { padding: "12px", borderBottom: `1px solid ${c("#f3f4f6","#374151")}`, color: c("#374151","#d1d5db"), fontSize: "0.875rem" },
    badge: (color, bg) => ({ padding: "3px 10px", borderRadius: "99px", fontSize: "0.75rem", fontWeight: "700", backgroundColor: bg, color }),
    btn: (color, text="white") => ({ padding: "7px 14px", borderRadius: "7px", border: "none", cursor: "pointer", fontSize: "0.82rem", fontWeight: "600", backgroundColor: color, color: text, display: "inline-flex", alignItems: "center", gap: "5px" }),
    iconBtn: () => ({ padding: "6px 10px", borderRadius: "6px", border: "none", cursor: "pointer", backgroundColor: isDark?"#374151":"#f3f4f6", color: isDark?"#d1d5db":"#374151", display: "inline-flex", alignItems: "center" }),
    modal: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
    modalBox: (w="460px") => ({ backgroundColor: c("white","#1f2937"), borderRadius: "14px", width: w, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }),
    modalHeader: { padding: "20px 24px", borderBottom: `1px solid ${c("#e5e7eb","#374151")}`, display: "flex", justifyContent: "space-between", alignItems: "center" },
    modalTitle: { fontSize: "1.1rem", fontWeight: "700", color: c("#111827","white") },
    modalBody: { padding: "24px" },
    modalFooter: { padding: "16px 24px", borderTop: `1px solid ${c("#e5e7eb","#374151")}`, display: "flex", justifyContent: "flex-end", gap: "10px" },
    input: { width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1px solid ${c("#d1d5db","#4b5563")}`, backgroundColor: c("white","#374151"), color: c("#111827","white"), fontSize: "0.9rem", outline: "none", boxSizing: "border-box" },
    select: { width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1px solid ${c("#d1d5db","#4b5563")}`, backgroundColor: c("white","#374151"), color: c("#111827","white"), fontSize: "0.9rem", outline: "none" },
    label: { fontSize: "0.8rem", fontWeight: "700", color: c("#374151","#d1d5db"), marginBottom: "5px", display: "block" },
    fg: { marginBottom: "14px" },
    toast: (type) => ({ position: "fixed", bottom: "24px", right: "24px", padding: "12px 20px", borderRadius: "10px", backgroundColor: type==="success"?"#10b981":"#ef4444", color: "white", fontWeight: "700", fontSize: "0.9rem", zIndex: 2000, animation: "slideUp 0.3s ease" }),
    viewRow: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${c("#f3f4f6","#374151")}`, fontSize: "0.875rem" },
  };

  const roleBadge = (role) => {
    const map = { admin:["#3b82f6","rgba(59,130,246,0.1)"], manager:["#10b981","rgba(16,185,129,0.1)"], cashier:["#f59e0b","rgba(245,158,11,0.1)"], pending:["#6b7280","rgba(107,114,128,0.1)"] };
    const [color, bg] = map[role] || ["#6b7280","rgba(107,114,128,0.1)"];
    return s.badge(color, bg);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { id: "stores", label: "Stores", icon: <FaStore /> },
    { id: "users", label: "Users", icon: <FaUsers /> },
    { id: "pending", label: "Pending", icon: <FaClock />, count: pendingUsers.length },
    { id: "reports", label: "Reports", icon: <FaFileAlt /> },
    { id: "settings", label: "Settings", icon: <FaCog /> },
  ];

  if (loading) return (
    <div style={{ ...s.container, justifyContent:"center", alignItems:"center" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:44, height:44, border:"3px solid #e5e7eb", borderTopColor:"#3b82f6", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 12px" }} />
        <p style={{ color:c("#6b7280","#9ca3af") }}>Loading dashboard...</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={s.container}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
      {toast && <div style={s.toast(toast.type)}>{toast.msg}</div>}

      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={{ padding:"24px", borderBottom:`1px solid ${c("#e5e7eb","#374151")}` }}>
          <div style={{ fontSize:"1.4rem", fontWeight:"900", color:c("#111827","white") }}>MeroByapar</div>
          <span style={{ fontSize:"0.72rem", color:"#3b82f6", background:"rgba(59,130,246,0.1)", padding:"2px 8px", borderRadius:"99px", marginTop:"6px", display:"inline-block" }}>Super Admin</span>
        </div>
        <div style={{ padding:"12px" }}>
          {navItems.map(item => (
            <div key={item.id} style={s.navItem(activeTab === item.id)} onClick={() => setActiveTab(item.id)}>
              {item.icon} {item.label}
              {item.count > 0 && <span style={{ marginLeft:"auto", backgroundColor:"#ef4444", color:"white", borderRadius:"99px", padding:"1px 7px", fontSize:"0.7rem", fontWeight:"700" }}>{item.count}</span>}
            </div>
          ))}
          <div style={{ borderTop:`1px solid ${c("#e5e7eb","#374151")}`, margin:"12px 0", padding:"12px 0" }}>
            <div style={s.navItem(false)} onClick={() => setShowLogoutModal(true)}><FaSignOutAlt /> Logout</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={s.main}>
        <div style={s.topBar}>
          <h1 style={{ fontSize:"1.3rem", fontWeight:"700", color:c("#111827","white") }}>
            {navItems.find(i => i.id === activeTab)?.label}
          </h1>
          <div style={s.userSection}>
            <ThemeToggle />
            <div style={s.userInfo} onClick={() => setShowUserMenu(!showUserMenu)}>
              <FaUserCircle size={22} color="#3b82f6" />
              <div>
                <div style={{ fontSize:"0.85rem", fontWeight:"600", color:c("#111827","white") }}>{currentUser.name || "Admin"}</div>
                <div style={{ fontSize:"0.72rem", color:c("#6b7280","#9ca3af") }}>Super Admin</div>
              </div>
            </div>
            {showUserMenu && (
              <div style={s.userMenu}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"11px 16px", cursor:"pointer", color:c("#374151","#d1d5db"), fontSize:"0.875rem" }} onClick={() => { setActiveTab("settings"); setShowUserMenu(false); }}><FaCog size={13}/> Settings</div>
                <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"11px 16px", cursor:"pointer", color:"#ef4444", fontSize:"0.875rem" }} onClick={() => { setShowUserMenu(false); setShowLogoutModal(true); }}><FaSignOutAlt size={13}/> Logout</div>
              </div>
            )}
          </div>
        </div>

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div>
            {pendingUsers.length > 0 && (
              <div style={{ backgroundColor:isDark?"rgba(239,68,68,0.1)":"rgba(239,68,68,0.05)", border:"1px solid #ef4444", borderRadius:"10px", padding:"14px 20px", marginBottom:"20px", display:"flex", alignItems:"center", gap:"12px" }}>
                <FaExclamationTriangle color="#ef4444" />
                <span style={{ flex:1, color:c("#111827","white"), fontSize:"0.9rem" }}><strong>{pendingUsers.length} user(s)</strong> waiting for role assignment.</span>
                <button style={s.btn("#ef4444")} onClick={() => setActiveTab("pending")}>Review Now</button>
              </div>
            )}
            <div style={s.statsGrid}>
              {[
                { label:"Total Stores", value:stores.length, icon:<FaStore size={30}/>, accent:"#3b82f6" },
                { label:"Active Stores", value:activeStores, icon:<FaCheckCircle size={30}/>, accent:"#10b981" },
                { label:"Total Users", value:users.length, icon:<FaUsers size={30}/>, accent:"#8b5cf6" },
                { label:"Pending Approval", value:pendingUsers.length, icon:<FaClock size={30}/>, accent:"#f59e0b" },
              ].map((card,i) => (
                <div key={i} style={s.statCard(card.accent)}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <p style={{ color:c("#6b7280","#9ca3af"), fontSize:"0.8rem", marginBottom:"4px" }}>{card.label}</p>
                      <p style={{ fontSize:"1.8rem", fontWeight:"800", color:c("#111827","white") }}>{card.value}</p>
                    </div>
                    <div style={{ color:card.accent, opacity:0.7 }}>{card.icon}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={s.tableWrap}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"16px" }}>
                <h3 style={{ fontWeight:"700", color:c("#111827","white") }}>Stores Overview</h3>
                <button style={s.btn("#3b82f6")} onClick={() => setActiveTab("stores")}>View All →</button>
              </div>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr><th style={s.th}>Store</th><th style={s.th}>Owner</th><th style={s.th}>Phone</th><th style={s.th}>Status</th></tr></thead>
                <tbody>
                  {stores.slice(0,5).map(store => (
                    <tr key={store._id}>
                      <td style={{ ...s.td, fontWeight:"600" }}>{store.store_name}</td>
                      <td style={s.td}>{store.store_owner}</td>
                      <td style={s.td}>{store.phone}</td>
                      <td style={s.td}><span style={s.badge(store.isActive!==false?"#10b981":"#ef4444", store.isActive!==false?"rgba(16,185,129,0.1)":"rgba(239,68,68,0.1)")}>{store.isActive!==false?"Active":"Inactive"}</span></td>
                    </tr>
                  ))}
                  {stores.length === 0 && <tr><td colSpan="4" style={{ ...s.td, textAlign:"center", color:c("#9ca3af","#6b7280") }}>No stores yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STORES */}
        {activeTab === "stores" && (
          <div style={s.tableWrap}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"20px" }}>
              <h3 style={{ fontWeight:"700", color:c("#111827","white") }}>All Stores ({stores.length})</h3>
              <button style={s.btn("#3b82f6")} onClick={() => openModal("addStore", { store_name:"", store_owner:"", phone:"", address:"" })}><FaPlus size={11}/> Add Store</button>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr>{["Store Name","Owner","Phone","Address","Status","Actions"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>
                {stores.map(store => (
                  <tr key={store._id}>
                    <td style={{ ...s.td, fontWeight:"600" }}>{store.store_name}</td>
                    <td style={s.td}>{store.store_owner}</td>
                    <td style={s.td}>{store.phone}</td>
                    <td style={s.td}>{store.address}</td>
                    <td style={s.td}><span style={s.badge(store.isActive!==false?"#10b981":"#ef4444", store.isActive!==false?"rgba(16,185,129,0.1)":"rgba(239,68,68,0.1)")}>{store.isActive!==false?"Active":"Inactive"}</span></td>
                    <td style={s.td}>
                      <div style={{ display:"flex", gap:"6px" }}>
                        <button style={s.iconBtn()} onClick={() => openModal("viewStore", store)}><FaEye size={12}/></button>
                        <button style={s.iconBtn()} onClick={() => openModal("editStore", store)}><FaEdit size={12}/></button>
                        <button style={{ ...s.iconBtn(), backgroundColor:isDark?"#7f1d1d":"#fee2e2", color:"#ef4444" }} onClick={() => openModal("deleteStore", store)}><FaTrash size={12}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {stores.length === 0 && <tr><td colSpan="6" style={{ ...s.td, textAlign:"center", color:c("#9ca3af","#6b7280") }}>No stores found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <div style={s.tableWrap}>
            <h3 style={{ fontWeight:"700", color:c("#111827","white"), marginBottom:"20px" }}>
              All Active Users ({users.filter(u => u.role !== "pending").length})
            </h3>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr>{["Name","Email","Role","Store","Status","Actions"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>
                {users.filter(u => u.role !== "pending").map(user => (
                  <tr key={user._id}>
                    <td style={{ ...s.td, fontWeight:"600" }}>{user.name}</td>
                    <td style={s.td}>{user.email}</td>
                    <td style={s.td}><span style={roleBadge(user.role)}>{user.role}</span></td>
                    <td style={s.td}>{user.store_id?.store_name || "—"}</td>
                    <td style={s.td}>
                      <span style={{ ...s.badge(user.isActive?"#10b981":"#ef4444", user.isActive?"rgba(16,185,129,0.1)":"rgba(239,68,68,0.1)"), cursor:"pointer" }} onClick={() => handleToggleActive(user)}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={s.td}>
                      <div style={{ display:"flex", gap:"6px" }}>
                        <button style={s.btn("#8b5cf6")} onClick={() => openModal("assignRole", { ...user, store_id: user.store_id?._id || "" })}><FaKey size={11}/> Role</button>
                        <button style={s.btn("#f59e0b")} onClick={() => openModal("changePassword", user)}><FaLock size={11}/> Pass</button>
                        <button style={{ ...s.iconBtn(), backgroundColor:isDark?"#7f1d1d":"#fee2e2", color:"#ef4444" }} onClick={() => openModal("deleteUser", user)}><FaTrash size={12}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PENDING */}
        {activeTab === "pending" && (
          pendingUsers.length === 0 ? (
            <div style={{ ...s.tableWrap, textAlign:"center", padding:"60px" }}>
              <FaCheckCircle size={48} color="#10b981" style={{ margin:"0 auto 16px", display:"block" }} />
              <h3 style={{ fontWeight:"700", color:c("#111827","white"), marginBottom:"8px" }}>All caught up!</h3>
              <p style={{ color:c("#6b7280","#9ca3af") }}>No users are waiting for approval.</p>
            </div>
          ) : (
            <div style={s.tableWrap}>
              <h3 style={{ fontWeight:"700", color:c("#111827","white"), marginBottom:"20px" }}>Pending Users ({pendingUsers.length})</h3>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr>{["Name","Email","Store (Chosen)","Email Verified","Registered","Action"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {pendingUsers.map(user => (
                    <tr key={user._id}>
                      <td style={{ ...s.td, fontWeight:"600" }}>{user.name}</td>
                      <td style={s.td}>{user.email}</td>
                      <td style={s.td}>{user.store_id?.store_name || "—"}</td>
                      <td style={s.td}>
                        <span style={s.badge(user.isVerified?"#10b981":"#f59e0b", user.isVerified?"rgba(16,185,129,0.1)":"rgba(245,158,11,0.1)")}>
                          {user.isVerified ? "✓ Verified" : "⏳ Not verified"}
                        </span>
                      </td>
                      <td style={s.td}>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td style={s.td}>
                        <button style={s.btn("#3b82f6")} onClick={() => openModal("assignRole", { ...user, store_id: user.store_id?._id || "" })}>
                          <FaKey size={11}/> Assign Role
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* REPORTS */}
        {activeTab === "reports" && (
          <div style={s.tableWrap}>
            <h3 style={{ fontWeight:"700", color:c("#111827","white"), marginBottom:"20px" }}>Available Reports</h3>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr>{["Report Name","Date","Type","Size","Downloads","Action"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>
                {reports.map(report => (
                  <tr key={report.id}>
                    <td style={{ ...s.td, fontWeight:"600" }}>{report.name}</td>
                    <td style={s.td}>{report.date}</td>
                    <td style={s.td}><span style={s.badge("#3b82f6","rgba(59,130,246,0.1)")}>{report.type}</span></td>
                    <td style={s.td}>{report.size}</td>
                    <td style={s.td}>{report.downloads}</td>
                    <td style={s.td}><button style={s.btn("#3b82f6")} onClick={() => handleDownload(report)}><FaDownload size={11}/> Download</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div style={{ ...s.tableWrap, maxWidth:"580px" }}>
            <h3 style={{ fontWeight:"700", color:c("#111827","white"), marginBottom:"24px" }}>System Settings</h3>
            <div style={s.fg}><label style={s.label}>System Name</label><input style={s.input} value={settingsData.systemName} onChange={e => setSettingsData(p => ({...p,systemName:e.target.value}))} /></div>
            <div style={s.fg}><label style={s.label}>Admin Email</label><input style={s.input} type="email" value={settingsData.adminEmail} onChange={e => setSettingsData(p => ({...p,adminEmail:e.target.value}))} /></div>
            <div style={s.fg}><label style={s.label}>Session Timeout (minutes)</label><input style={{ ...s.input, width:"90px" }} type="number" value={settingsData.sessionTimeout} onChange={e => setSettingsData(p => ({...p,sessionTimeout:e.target.value}))} /></div>
            <div style={{ borderTop:`1px solid ${c("#e5e7eb","#374151")}`, margin:"20px 0" }} />
            <h4 style={{ fontWeight:"700", color:c("#111827","white"), marginBottom:"12px" }}>Live Stats</h4>
            <div style={{ display:"grid", gap:"10px", marginBottom:"20px" }}>
              {[["Total Stores",stores.length],["Total Users",users.length],["Pending Users",pendingUsers.length],["Active Stores",activeStores]].map(([k,v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"10px 14px", backgroundColor:c("#f9fafb","#374151"), borderRadius:"8px" }}>
                  <span style={{ color:c("#6b7280","#9ca3af"), fontSize:"0.875rem" }}>{k}</span>
                  <strong style={{ color:c("#111827","white") }}>{v}</strong>
                </div>
              ))}
            </div>
            <button style={{ ...s.btn("#3b82f6"), padding:"11px 24px" }} onClick={() => showToast("Settings saved!")}><FaSave size={13}/> Save Settings</button>
          </div>
        )}
      </div>

      {/* ══ MODALS ══ */}

      {modal.type === "viewStore" && (
        <div style={s.modal} onClick={closeModal}>
          <div style={s.modalBox()} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}><span style={s.modalTitle}>Store Details</span><button style={{ background:"none",border:"none",cursor:"pointer",color:c("#6b7280","#9ca3af") }} onClick={closeModal}><FaTimes /></button></div>
            <div style={s.modalBody}>
              {[["Store Name",modal.data.store_name],["Owner",modal.data.store_owner],["Phone",modal.data.phone],["Address",modal.data.address],["Status",modal.data.isActive!==false?"Active":"Inactive"]].map(([k,v]) => (
                <div key={k} style={s.viewRow}><span style={{ color:c("#6b7280","#9ca3af") }}>{k}</span><span style={{ color:c("#111827","white"),fontWeight:"600" }}>{v}</span></div>
              ))}
            </div>
            <div style={s.modalFooter}><button style={s.btn(c("#f3f4f6","#374151"),c("#374151","white"))} onClick={closeModal}>Close</button></div>
          </div>
        </div>
      )}

      {(modal.type === "addStore" || modal.type === "editStore") && (
        <div style={s.modal} onClick={closeModal}>
          <div style={s.modalBox()} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}><span style={s.modalTitle}>{modal.type==="addStore"?"Add New Store":"Edit Store"}</span><button style={{ background:"none",border:"none",cursor:"pointer",color:c("#6b7280","#9ca3af") }} onClick={closeModal}><FaTimes /></button></div>
            <div style={s.modalBody}>
              {[["store_name","Store Name *","text"],["store_owner","Owner Name *","text"],["phone","Phone *","text"],["address","Address *","text"]].map(([field,label,type]) => (
                <div key={field} style={s.fg}><label style={s.label}>{label}</label><input style={s.input} type={type} value={formData[field]||""} onChange={e => setFormData(p => ({...p,[field]:e.target.value}))} /></div>
              ))}
            </div>
            <div style={s.modalFooter}>
              <button style={s.btn(c("#f3f4f6","#374151"),c("#374151","white"))} onClick={closeModal}>Cancel</button>
              <button style={s.btn("#3b82f6")} onClick={handleSaveStore} disabled={apiLoading}><FaSave size={12}/> {apiLoading?"Saving...":modal.type==="addStore"?"Add Store":"Save"}</button>
            </div>
          </div>
        </div>
      )}

      {modal.type === "deleteStore" && (
        <div style={s.modal} onClick={closeModal}>
          <div style={s.modalBox("380px")} onClick={e => e.stopPropagation()}>
            <div style={s.modalBody}>
              <div style={{ textAlign:"center" }}>
                <FaExclamationTriangle size={44} color="#ef4444" style={{ margin:"0 auto 16px" }} />
                <h3 style={{ fontWeight:"700",color:c("#111827","white"),marginBottom:"8px" }}>Delete Store?</h3>
                <p style={{ color:c("#6b7280","#9ca3af"),marginBottom:"24px" }}>Delete <strong style={{ color:c("#111827","white") }}>{modal.data?.store_name}</strong>? This cannot be undone.</p>
                <div style={{ display:"flex",gap:"10px" }}>
                  <button style={{ ...s.btn(c("#f3f4f6","#374151"),c("#374151","white")),flex:1,justifyContent:"center" }} onClick={closeModal}>Cancel</button>
                  <button style={{ ...s.btn("#ef4444"),flex:1,justifyContent:"center" }} onClick={handleDeleteStore} disabled={apiLoading}>{apiLoading?"Deleting...":"Delete"}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {modal.type === "assignRole" && (
        <div style={s.modal} onClick={closeModal}>
          <div style={s.modalBox()} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}><span style={s.modalTitle}>Assign Role — {modal.data.name}</span><button style={{ background:"none",border:"none",cursor:"pointer",color:c("#6b7280","#9ca3af") }} onClick={closeModal}><FaTimes /></button></div>
            <div style={s.modalBody}>
              <div style={{ backgroundColor:c("#f9fafb","#374151"), borderRadius:"10px", padding:"14px", marginBottom:"20px" }}>
                <div style={{ fontWeight:"600", color:c("#111827","white") }}>{modal.data.name}</div>
                <div style={{ fontSize:"0.85rem", color:c("#6b7280","#9ca3af") }}>{modal.data.email}</div>
                <div style={{ marginTop:"8px" }}><span style={roleBadge(modal.data.role)}>Current: {modal.data.role}</span></div>
              </div>
              <div style={s.fg}>
                <label style={s.label}>New Role *</label>
                <select style={s.select} value={formData.role||""} onChange={e => setFormData(p => ({...p,role:e.target.value}))}>
                  <option value="">-- Select Role --</option>
                  <option value="manager">Manager</option>
                  <option value="cashier">Cashier</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={s.fg}>
                <label style={s.label}>Assign Store {formData.role === "pending" ? "" : "(optional — overrides user's chosen store)"}</label>
                <select style={s.select} value={formData.store_id||""} onChange={e => setFormData(p => ({...p,store_id:e.target.value}))}>
                  <option value="">-- Keep user's chosen store --</option>
                  {stores.map(store => <option key={store._id} value={store._id}>{store.store_name}</option>)}
                </select>
              </div>
            </div>
            <div style={s.modalFooter}>
              <button style={s.btn(c("#f3f4f6","#374151"),c("#374151","white"))} onClick={closeModal}>Cancel</button>
              <button style={s.btn("#3b82f6")} onClick={handleAssignRole} disabled={apiLoading}><FaKey size={11}/> {apiLoading?"Assigning...":"Assign Role"}</button>
            </div>
          </div>
        </div>
      )}

      {modal.type === "deleteUser" && (
        <div style={s.modal} onClick={closeModal}>
          <div style={s.modalBox("380px")} onClick={e => e.stopPropagation()}>
            <div style={s.modalBody}>
              <div style={{ textAlign:"center" }}>
                <FaExclamationTriangle size={44} color="#ef4444" style={{ margin:"0 auto 16px" }} />
                <h3 style={{ fontWeight:"700",color:c("#111827","white"),marginBottom:"8px" }}>Delete User?</h3>
                <p style={{ color:c("#6b7280","#9ca3af"),marginBottom:"24px" }}>Delete <strong style={{ color:c("#111827","white") }}>{modal.data?.name}</strong>?</p>
                <div style={{ display:"flex",gap:"10px" }}>
                  <button style={{ ...s.btn(c("#f3f4f6","#374151"),c("#374151","white")),flex:1,justifyContent:"center" }} onClick={closeModal}>Cancel</button>
                  <button style={{ ...s.btn("#ef4444"),flex:1,justifyContent:"center" }} onClick={handleDeleteUser} disabled={apiLoading}>{apiLoading?"Deleting...":"Delete"}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {modal.type === "changePassword" && (
        <div style={s.modal} onClick={closeModal}>
          <div style={s.modalBox("420px")} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <span style={s.modalTitle}>Change Password — {modal.data.name}</span>
              <button style={{ background:"none",border:"none",cursor:"pointer",color:c("#6b7280","#9ca3af") }} onClick={closeModal}><FaTimes /></button>
            </div>
            <div style={s.modalBody}>
              <div style={{ backgroundColor:c("#f9fafb","#374151"), borderRadius:"10px", padding:"14px", marginBottom:"20px", display:"flex", alignItems:"center", gap:"12px" }}>
                <FaUserCircle size={36} color="#f59e0b" />
                <div>
                  <div style={{ fontWeight:"700", color:c("#111827","white") }}>{modal.data.name}</div>
                  <div style={{ fontSize:"0.82rem", color:c("#6b7280","#9ca3af") }}>{modal.data.email}</div>
                  <span style={roleBadge(modal.data.role)}>{modal.data.role}</span>
                </div>
              </div>
              <div style={s.fg}>
                <label style={s.label}>New Password *</label>
                <input
                  style={s.input}
                  type="password"
                  placeholder="Min 6 characters"
                  value={formData.newPassword || ""}
                  onChange={e => setFormData(p => ({...p, newPassword: e.target.value}))}
                />
              </div>
              <div style={s.fg}>
                <label style={s.label}>Confirm New Password *</label>
                <input
                  style={{
                    ...s.input,
                    borderColor: formData.confirmPassword && formData.newPassword !== formData.confirmPassword ? "#ef4444" : c("#d1d5db","#4b5563")
                  }}
                  type="password"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword || ""}
                  onChange={e => setFormData(p => ({...p, confirmPassword: e.target.value}))}
                />
                {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                  <p style={{ color:"#ef4444", fontSize:"0.78rem", marginTop:"4px" }}>Passwords do not match</p>
                )}
              </div>
              <div style={{ backgroundColor:isDark?"rgba(245,158,11,0.1)":"rgba(245,158,11,0.05)", border:"1px solid #f59e0b", borderRadius:"8px", padding:"10px 14px", fontSize:"0.82rem", color:c("#92400e","#fbbf24") }}>
                ⚠️ The user will need to use this new password on their next login.
              </div>
            </div>
            <div style={s.modalFooter}>
              <button style={s.btn(c("#f3f4f6","#374151"),c("#374151","white"))} onClick={closeModal}>Cancel</button>
              <button style={s.btn("#f59e0b")} onClick={handleChangePassword} disabled={apiLoading}>
                <FaLock size={11}/> {apiLoading ? "Saving..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div style={s.modal} onClick={() => setShowLogoutModal(false)}>
          <div style={s.modalBox("360px")} onClick={e => e.stopPropagation()}>
            <div style={s.modalBody}>
              <div style={{ textAlign:"center" }}>
                <FaExclamationTriangle size={44} color="#f59e0b" style={{ margin:"0 auto 16px" }} />
                <h3 style={{ fontWeight:"700",color:c("#111827","white"),marginBottom:"8px" }}>Confirm Logout</h3>
                <p style={{ color:c("#6b7280","#9ca3af"),marginBottom:"24px" }}>Are you sure?</p>
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

export default AdminDashboard;
