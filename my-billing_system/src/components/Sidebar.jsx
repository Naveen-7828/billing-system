import { Link } from "react-router-dom";
import "../sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">

      <div className="sidebar-header">
        <h2>Forge India</h2>
        <p>Billing System</p>
      </div>

      <div className="sidebar-divider"></div>

      <ul className="sidebar-menu">

        <li>
          <Link to="/" className="sidebar-link">
            <span>📊</span>
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/customers" className="sidebar-link">
            <span>👥</span>
            Customers
          </Link>
        </li>

        <li>
          <Link to="/products" className="sidebar-link">
            <span>📦</span>
            Products
          </Link>
        </li>

        <li>
          <Link to="/billing" className="sidebar-link">
            <span>🧾</span>
            Billing
          </Link>
        </li>

        <li>
          <Link to="/invoices" className="sidebar-link">
            <span>📄</span>
            Invoices
          </Link>
        </li>

        <li>
          <Link to="/payments" className="sidebar-link">
            <span>💳</span>
            Payments
          </Link>
        </li>

        <li>
          <Link to="/users" className="sidebar-link">
            <span>👤</span>
            Users
          </Link>
        </li>

      </ul>

      <div className="sidebar-footer">

  <button
    className="logout-btn"
    onClick={() => {

      localStorage.removeItem("user");

      window.location.href="/login";

    }}
  >
    Logout
  </button>

</div>

    </div>
  );
}

export default Sidebar;