const BASE_URL = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return await res.json();
}

export async function register(name, email, password) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return await res.json();
}

export async function forgotPassword(email) {
  const res = await fetch(`${BASE_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return await res.json();
}

export async function resetPassword(token, newPassword) {
  const res = await fetch(`${BASE_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });
  return await res.json();
}

// ─── STORES ──────────────────────────────────────────────────────────────────

export async function getStores() {
  const res = await fetch(`${BASE_URL}/store`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return await res.json();
}

export async function createStore(data) {
  const res = await fetch(`${BASE_URL}/store`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function updateStore(id, data) {
  const res = await fetch(`${BASE_URL}/store/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function deleteStore(id) {
  const res = await fetch(`${BASE_URL}/store/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return await res.json();
}

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

export async function getCategories() {
  const res = await fetch(`${BASE_URL}/category`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return await res.json();
}

export async function createCategory(data) {
  const res = await fetch(`${BASE_URL}/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function deleteCategory(id) {
  const res = await fetch(`${BASE_URL}/category/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return await res.json();
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

export async function getProducts() {
  const res = await fetch(`${BASE_URL}/product`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return await res.json();
}

export async function createProduct(data) {
  const res = await fetch(`${BASE_URL}/product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function updateProduct(id, data) {
  const res = await fetch(`${BASE_URL}/product/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${BASE_URL}/product/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return await res.json();
}

// ─── SUPPLIERS ───────────────────────────────────────────────────────────────

export async function getSuppliers() {
  const res = await fetch(`${BASE_URL}/suppliers`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return await res.json();
}

export async function createSupplier(data) {
  const res = await fetch(`${BASE_URL}/supplier`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

// ─── SALES ───────────────────────────────────────────────────────────────────

export async function getSales() {
  const res = await fetch(`${BASE_URL}/sales`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return await res.json();
}

export async function createSale(data) {
  const res = await fetch(`${BASE_URL}/sales`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function createSaleItem(data) {
  const res = await fetch(`${BASE_URL}/sale-item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function bulkCreateSaleItems(sale_id, items) {
  const res = await fetch(`${BASE_URL}/sale-item/bulk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ sale_id, items }),
  });
  return await res.json();
}

// ─── PURCHASES ───────────────────────────────────────────────────────────────

export async function getPurchases() {
  const res = await fetch(`${BASE_URL}/purchase`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return await res.json();
}

export async function createPurchase(data) {
  const res = await fetch(`${BASE_URL}/purchase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function createPurchaseItem(data) {
  const res = await fetch(`${BASE_URL}/purchase-item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

// ─── USERS ───────────────────────────────────────────────────────────────────

export async function getUsers() {
  const res = await fetch(`${BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return await res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/user/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return await res.json();
}
