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

  const user = localStorage.getItem("user");

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route
  path="/login"
  element={<Login />}
/>

<Route
  path="*"
  element={<Navigate to="/login" />}
/>
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
            <Route path="/customers" element={<Customers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/users" element={<Users />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

        </div>

      </div>

    </BrowserRouter>
  );
}

export default App;