import { useEffect, useState } from "react";
import axios from "axios";
import "../User.css";

const API_URL = import.meta.env.VITE_API_URL;

function Users() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    role: "USER"
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    axios.get(`${API_URL}/api/users`)
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ADD / UPDATE LOGIC
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {

      // UPDATE USER
      axios.put(`${API_URL}/api/users/${editId}`, form)
        .then(() => {
          loadUsers();
          resetForm();
        })
        .catch(err => console.log(err));

    } else {

      // CREATE USER
      axios.post(`${API_URL}/api/users`, form)
        .then(() => {
          loadUsers();
          resetForm();
        })
        .catch(err => console.log(err));
    }
  };

  const handleEdit = (user) => {
    setEditId(user.id);

    setForm({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      password: "",
      role: user.role
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete User?")) {
      axios.delete(`${API_URL}/api/users/${id}`)
        .then(() => loadUsers())
        .catch(err => console.log(err));
    }
  };

  const resetForm = () => {
    setForm({
      fullName: "",
      username: "",
      email: "",
      password: "",
      role: "USER"
    });
    setEditId(null);
  };

  const filteredUsers = users.filter(u =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="users-page">

      <div className="users-header">
        <h1>User Management</h1>
      </div>

      {/* FORM */}
      <div className="users-card">

        <h2>{editId ? "Update User" : "Add User"}</h2>

        <form className="users-form-grid" onSubmit={handleSubmit}>

          <input name="fullName" placeholder="Full Name"
            value={form.fullName} onChange={handleChange} required />

          <input name="username" placeholder="Username"
            value={form.username} onChange={handleChange} required />

          <input name="email" placeholder="Email"
            value={form.email} onChange={handleChange} required />

          <input type="password" name="password"
            placeholder="Password (leave empty to keep old)"
            value={form.password} onChange={handleChange} />

          <select name="role" value={form.role} onChange={handleChange}>
            <option value="ADMIN">ADMIN</option>
            <option value="MANAGER">MANAGER</option>
            <option value="CASHIER">CASHIER</option>
            <option value="ACCOUNTANT">ACCOUNTANT</option>
            <option value="USER">USER</option>
          </select>

          <button className="save-user-btn" type="submit">
            {editId ? "Update User" : "Add User"}
          </button>

          {editId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}

        </form>
      </div>

      {/* TABLE */}
      <div className="users-card">

        <input
          className="search-box"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <table className="users-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id}>

                <td>{u.id}</td>
                <td>{u.fullName}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>

                <td>
                  <span className={`role-badge role-${u.role?.toLowerCase()}`}>
                    {u.role}
                  </span>
                </td>

                <td>
                <div className="action-btns">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(u)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-user-btn"
                    onClick={() => handleDelete(u.id)}
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
  );
}

export default Users;