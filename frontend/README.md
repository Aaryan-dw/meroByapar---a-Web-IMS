# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

Good question 👍 If you use the **final structure with separate dashboards**, each page should have a **clear responsibility**. Think of it as **who uses what** in your system.


---

# 📁 src/pages

```text
Home.jsx
Login.jsx
Register.jsx
AdminDashboard.jsx
ManagerDashboard.jsx
CashierDashboard.jsx
```

---

# 1️⃣ Home.jsx

**Purpose:** Landing page / public page.

What to show:

* Project name **MeroByapar**
* Short description
* Login button
* Register button
* maybe business info

Example UI idea:

```
Navbar
Welcome to MeroByapar
Manage your business easily
[Login] [Register]
Footer
```

---

# 2️⃣ Login.jsx

**Purpose:** User authentication.

Fields:

```
Email
Password
Login button
```

After login:

```
if role == admin → /admin
if role == manager → /manager
if role == cashier → /cashier
```

---

# 3️⃣ Register.jsx

**Purpose:** Create account.

Fields:

```
Name
Email
Password
Role (Admin / Manager / Cashier)
```

Later you may restrict roles.

---

# 4️⃣ AdminDashboard.jsx

**Purpose:** System control.

Admin can manage everything.

Features:

```
View all businesses
Manage managers
Manage cashiers
View reports
Manage users
```

Example sections:

```
Dashboard stats
Total Businesses
Total Sales
Total Users
```

---

# 5️⃣ ManagerDashboard.jsx

**Purpose:** Business management.

Manager controls business operations.

Features:

```
Add products
Update products
View inventory
View sales
Manage cashier
```

Example:

```
Add Product
Edit Product
View Product List
```

---

# 6️⃣ CashierDashboard.jsx

**Purpose:** Sales operations.

Cashier handles transactions.

Features:

```
Create bill
Select products
Calculate total
Print receipt
View today's sales
```

Example UI:

```
Product List
Cart
Total Price
Checkout Button
```

---

# 🧠 Simple System Flow

```
User opens site
        │
        ▼
Home Page
        │
        ▼
Login / Register
        │
        ▼
Role check
        │
 ┌──────┴────────┐
 ▼               ▼
Admin         Manager
 │               │
 ▼               ▼
AdminDashboard  ManagerDashboard
        │
        ▼
CashierDashboard
```

---

# 🧱 Components 

Inside **src/components**

```
Navbar.jsx
Sidebar.jsx
Footer.jsx
ProductCard.jsx
Table.jsx
```

# 📦 Backend APIs
```
POST /login
POST /register
GET /products
POST /products
GET /sales
POST /sales
```
 **core modules**:

Authentication
Role-based dashboard
Product management
Sales system
Reports
