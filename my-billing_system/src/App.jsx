import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customer";
import Products from "./pages/Products";
import Invoices from "./pages/Invoices";
import Payments from "./pages/Payment";
import Users from "./pages/Users";
import Billing from "./pages/Billing";

function App() {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const role = user?.role;

  const allowedRoutes = {
    ADMIN: [
      "/",
      "/customers",
      "/products",
      "/billing",
      "/invoices",
      "/payments",
      "/users"
    ],

   MANAGER: [
  "/",
  "/customers",
  "/products",
  "/billing",
  "/invoices",
  "/payments"
],

    CASHIER: [
      "/",
      "/billing",
      "/payments",
      "/invoices"
    ],

    ACCOUNTANT: [
      "/",
      "/invoices",
      "/payments"
    ],

    USER: [
      "/"
    ]
  };

  const canAccess = (path) => {
    return allowedRoutes[role]?.includes(path);
  };

  const ProtectedRoute = ({ path, children }) => {
    if (!canAccess(path)) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}>
        <Sidebar />

        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route
              path="/customers"
              element={
                <ProtectedRoute path="/customers">
                  <Customers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/products"
              element={
                <ProtectedRoute path="/products">
                  <Products />
                </ProtectedRoute>
              }
            />

            <Route
              path="/billing"
              element={
                <ProtectedRoute path="/billing">
                  <Billing />
                </ProtectedRoute>
              }
            />

            <Route
              path="/invoices"
              element={
                <ProtectedRoute path="/invoices">
                  <Invoices />
                </ProtectedRoute>
              }
            />

            <Route
              path="/payments"
              element={
                <ProtectedRoute path="/payments">
                  <Payments />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedRoute path="/users">
                  <Users />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;