import "../customer.css";
import { useEffect, useState } from "react";

import {
  getCustomers,
  createCustomer,
  deleteCustomer,
  updateCustomer
} from "../services/customerService";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    email: "",
    address: "",
    gstNumber: ""
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    getCustomers()
      .then((res) => {
        setCustomers(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      updateCustomer(editingId, formData)
        .then(() => {
          loadCustomers();
          resetForm();
        })
        .catch((err) => console.log(err));
    } else {
      createCustomer(formData)
        .then(() => {
          loadCustomers();
          resetForm();
        })
        .catch((err) => console.log(err));
    }
  };

  const handleEdit = (customer) => {
    setFormData({
      customerName: customer.customerName,
      phoneNumber: customer.phoneNumber,
      email: customer.email,
      address: customer.address,
      gstNumber: customer.gstNumber
    });

    setEditingId(customer.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete Customer?")) {
      deleteCustomer(id)
        .then(() => loadCustomers())
        .catch((err) => console.log(err));
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: "",
      phoneNumber: "",
      email: "",
      address: "",
      gstNumber: ""
    });

    setEditingId(null);
  };

  const filteredCustomers = customers.filter((c) =>
    c.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    c.phoneNumber?.includes(search) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="customer-content">

      {/* HEADER */}
      <div className="page-header">
        <h1>Customer Management</h1>
        <p>
          Manage customer records, GST details, addresses and contact
          information.
        </p>
      </div>

      {/* KPI CARD */}
      <div className="customer-kpi-grid">

        <div className="dashboard-card">
          <h3>Total Customers</h3>
          <h2>{customers.length}</h2>
        </div>

      </div>

      {/* FORM CARD */}
      <div className="customer-card">

        <h2>
          {editingId
            ? "✏️ Update Customer"
            : "➕ Add New Customer"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="customer-form-grid"
        >

          <input
            type="text"
            name="customerName"
            placeholder="Customer Name"
            value={formData.customerName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />

          <input
            type="text"
            name="gstNumber"
            placeholder="GST Number"
            value={formData.gstNumber}
            onChange={handleChange}
          />

          <div className="button-group">

            <button
              type="submit"
              className="save-btn"
            >
              {editingId
                ? "Update Customer"
                : "Add Customer"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      {/* SEARCH */}
      <div className="customer-card">

        <div className="table-header">

          <h2>📋 Customer List</h2>

          <input
            type="text"
            placeholder="Search customer..."
            className="search-box"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="table-container">

          <table className="modern-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>GST No</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredCustomers.map((customer) => (

                <tr key={customer.id}>

                  <td>{customer.id}</td>

                  <td>{customer.customerName}</td>

                  <td>{customer.phoneNumber}</td>

                  <td>{customer.email}</td>

                  <td>{customer.address}</td>

                  <td>{customer.gstNumber}</td>

                  <td>

                    <div className="action-buttons">

                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(customer)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(customer.id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>
                

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

    
  );
  <div className="customer-inner">
   {/* all content here */}
</div>
}

export default Customers;