import React, { useEffect, useState } from "react";
import axios from "axios";
import "../dashboard.css";

function Dashboard() {

    const [dashboard, setDashboard] = useState({});

    useEffect(() => {

        fetchDashboard();

        const interval = setInterval(() => {
            fetchDashboard();
        }, 30000);

        return () => clearInterval(interval);

    }, []);

    const fetchDashboard = () => {
        axios
            .get(`http://localhost:8080/api/dashboard?ts=${Date.now()}`)
            .then((res) => {
                setDashboard(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <div className="dashboard-container">

            {/* Header */}
            <div className="dashboard-header">
                <h1>Forge India Connect Pvt Ltd</h1>
                <p>Billing & Inventory Management Dashboard</p>
            </div>

            {/* KPI Cards */}
            <div className="stats-grid">

                <div className="stat-card customers">
                    <h3>Total Customers</h3>
                    <h1>{dashboard.totalCustomers || 0}</h1>
                </div>

                <div className="stat-card products">
                    <h3>Total Products</h3>
                    <h1>{dashboard.totalProducts || 0}</h1>
                </div>

                <div className="stat-card invoices">
                    <h3>Total Invoices</h3>
                    <h1>{dashboard.totalInvoices || 0}</h1>
                </div>

                <div className="stat-card revenue">
                    <h3>Total Revenue</h3>
                    <h1>₹{dashboard.totalRevenue || 0}</h1>
                </div>

                <div className="stat-card payments">
                    <h3>Total Payments</h3>
                    <h1>₹{dashboard.totalPayments || 0}</h1>
                </div>

                <div className="stat-card pending">
                    <h3>Pending Payments</h3>
                    <h1>₹{dashboard.pendingPayments || 0}</h1>
                </div>

            </div>

            {/* Tables */}
            <div className="dashboard-grid">

                {/* Low Stock */}
                <div className="stock-card">

                    <h2>⚠️Low Stock Products</h2>

                    <table className="stock-table">

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Product</th>
                                <th>Stock</th>
                            </tr>
                        </thead>

                        <tbody>

                            {dashboard.lowStockProducts?.length > 0 ? (

                                dashboard.lowStockProducts.map((p) => (

                                    <tr key={p.productId}>
                                        <td>{p.productId}</td>
                                        <td>{p.productName}</td>
                                        <td>
                                            <span className="stock-badge">
                                                {p.stockQuantity}
                                            </span>
                                        </td>
                                    </tr>

                                ))

                            ) : (

                                <tr>
                                    <td colSpan="3">
                                        No Low Stock Products
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

                {/* Recent Invoices */}
                <div className="stock-card">

                    <h2>📄 Recent Invoices</h2>

                    <table className="stock-table">

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Date</th>
                            </tr>
                        </thead>

                        <tbody>

                            {dashboard.recentInvoices?.length > 0 ? (

                                dashboard.recentInvoices.map((invoice) => (

                                    <tr key={invoice.invoiceId}>
                                        <td>
                                            INV-{invoice.invoiceId}
                                        </td>

                                        <td>
                                            {invoice.customerName}
                                        </td>

                                        <td>
                                            ₹{invoice.totalAmount}
                                        </td>

                                        <td>
                                            {invoice.invoiceDate
                                                ? new Date(
                                                      invoice.invoiceDate
                                                  ).toLocaleDateString()
                                                : "-"}
                                        </td>
                                    </tr>

                                ))

                            ) : (

                                <tr>
                                    <td colSpan="4">
                                        No Invoices Found
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;