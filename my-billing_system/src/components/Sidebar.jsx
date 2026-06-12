import { Link } from "react-router-dom";
import "../sidebar.css";

function Sidebar() {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const role = user?.role;

  const menuItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: "📊",
      roles: ["ADMIN", "MANAGER", "CASHIER", "ACCOUNTANT", "USER"]
    },
    {
      path: "/customers",
      label: "Customers",
      icon: "👥",
      roles: ["ADMIN", "MANAGER"]
    },
    {
      path: "/products",
      label: "Products",
      icon: "📦",
      roles: ["ADMIN", "MANAGER"]
    },
    {
      path: "/billing",
      label: "Billing",
      icon: "🧾",
      roles: ["ADMIN", "MANAGER", "CASHIER"]
    },
    {
      path: "/invoices",
      label: "Invoices",
      icon: "📄",
      roles: ["ADMIN", "MANAGER", "CASHIER", "ACCOUNTANT"]
    },
    {
      path: "/payments",
      label: "Payments",
      icon: "💳",
      roles: ["ADMIN", "MANAGER", "CASHIER", "ACCOUNTANT"]
    },
    {
      path: "/users",
      label: "Users",
      icon: "👤",
      roles: ["ADMIN"]
    }
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Forge India</h2>
        <p>Billing System</p>

        {user && (
          <small>
            {user.fullName || user.username} - {role}
          </small>
        )}
      </div>

      <div className="sidebar-divider"></div>

      <ul className="sidebar-menu">
        {filteredMenu.map((item) => (
          <li key={item.path}>
            <Link to={item.path} className="sidebar-link">
              <span>{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;