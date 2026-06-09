
import "../Product.css";
import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../services/productService";

function Products() {

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    productName: "",
    description: "",
    sku: "",
    sellingPrice: "",
    costPrice: "",
    stockQuantity: "",
    gstRate: ""
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setForm({
      productName: "",
      description: "",
      sku: "",
      sellingPrice: "",
      costPrice: "",
      stockQuantity: "",
      gstRate: ""
    });

    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      sellingPrice: Number(form.sellingPrice),
      costPrice: Number(form.costPrice),
      stockQuantity: Number(form.stockQuantity),
      gstRate: Number(form.gstRate)
    };

    if (editingId) {
      updateProduct(editingId, payload)
        .then(() => {
          loadProducts();
          resetForm();
        })
        .catch((err) => console.log(err));
    } else {
      createProduct(payload)
        .then(() => {
          loadProducts();
          resetForm();
        })
        .catch((err) => console.log(err));
    }
  };

  const handleEdit = (product) => {

    setEditingId(product.id);

    setForm({
      productName: product.productName || "",
      description: product.description || "",
      sku: product.sku || "",
      sellingPrice: product.sellingPrice || "",
      costPrice: product.costPrice || "",
      stockQuantity: product.stockQuantity || "",
      gstRate: product.gstRate || ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = (id) => {

    if (window.confirm("Delete Product?")) {

      deleteProduct(id)
        .then(() => loadProducts())
        .catch((err) => {
          console.log(err);
          alert("Unable to delete product");
        });
    }
  };

  const filteredProducts = products.filter((p) =>
    p.productName?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = products.filter(
    p => p.stockQuantity <= 5
  ).length;

  return (

    <div className="main-content">

      {/* HEADER */}
      <div className="page-header">
        <h1>Product Management</h1>
        <p>
          Manage inventory, pricing, GST and stock levels.
        </p>
      </div>

      {/* KPI */}
      <div className="product-kpi-grid">

        <div className="dashboard-card">
          <h3>Total Products</h3>
          <h2>{products.length}</h2>
        </div>

        <div className="dashboard-card warning">
          <h3>Low Stock Products</h3>
          <h2>{lowStockCount}</h2>
        </div>

      </div>

      {/* FORM CARD */}
      <div className="product-card">

        <h2>
          {editingId
            ? "✏️ Update Product"
            : "➕ Add Product" }
        </h2>

        <form
          onSubmit={handleSubmit}
          className="product-form-grid"
        >

          <input
            name="productName"
            placeholder="Product Name"
            value={form.productName}
            onChange={handleChange}
            required
          />

          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <input
            name="sku"
            placeholder="SKU"
            value={form.sku}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="sellingPrice"
            placeholder="Selling Price"
            value={form.sellingPrice}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="costPrice"
            placeholder="Cost Price"
            value={form.costPrice}
            onChange={handleChange}
          />

          <input
            type="number"
            name="stockQuantity"
            placeholder="Stock Quantity"
            value={form.stockQuantity}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="gstRate"
            placeholder="GST %"
            value={form.gstRate}
            onChange={handleChange}
            required
          />

          <div className="button-group">

            <button
              type="submit"
              className="save-btn"
            >
              {editingId
                ? "Update Product"
                : "Add Product"}
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

      {/* TABLE CARD */}
      <div className="product-card">

        <div className="table-header">

          <h2>📋 Product List</h2>

          <input
            type="text"
            className="search-box"
            placeholder="Search Product..."
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
                <th>SKU</th>
                <th>Selling Price</th>
                <th>Cost Price</th>
                <th>GST%</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredProducts.map((p) => (

                <tr key={p.id}>

                  <td>{p.id}</td>

                  <td>{p.productName}</td>

                  <td>{p.sku}</td>

                  <td>₹{p.sellingPrice}</td>

                  <td>₹{p.costPrice}</td>

                  <td>{p.gstRate}%</td>

                  <td>
                    <span
                      className={
                        p.stockQuantity <= 5
                          ? "stock-low"
                          : "stock-good"
                      }
                    >
                      {p.stockQuantity}
                    </span>
                  </td>

                  <td>

                    <div className="action-buttons">

                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(p.id)}
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
}

export default Products;
