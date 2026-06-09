import { useEffect, useState } from "react";
import "../Invoice.css";
import axios from "axios";

function Invoices() {

const [customers, setCustomers] = useState([]);
const [products, setProducts] = useState([]);
const [invoices, setInvoices] = useState([]);

const [customerId, setCustomerId] = useState("");

const [items, setItems] = useState([
{
productId: "",
quantity: 1
}
]);

useEffect(() => {


axios
  .get("http://localhost:8080/api/customer")
  .then((res) => setCustomers(res.data))
  .catch((err) => console.log(err));

axios
  .get("http://localhost:8080/api/product")
  .then((res) => setProducts(res.data))
  .catch((err) => console.log(err));

loadInvoices();

}, []);

const loadInvoices = () => {
  axios
    .get("http://localhost:8080/api/invoices")
    .then((res) => {
      console.log("Invoices:", res.data);
      setInvoices(res.data);
    })
    .catch((err) => console.log(err));
};

const handleItemChange = (index, field, value) => {
const updated = [...items];
updated[index][field] = value;
setItems(updated);
};

const addItem = () => {
setItems([
...items,
{
productId: "",
quantity: 1
}
]);
};

const removeItem = (index) => {
const updated = items.filter((_, i) => i !== index);
setItems(updated);
};

const handleSubmit = (e) => {
e.preventDefault();

const payload = {
  customer: {
    id: Number(customerId)
  },
  items: items.map((item) => ({
    product: {
      id: Number(item.productId)
    },
    quantity: Number(item.quantity)
  }))
};

axios
  .post("http://localhost:8080/api/invoices", payload)
  .then(() => {

    loadInvoices();

    setCustomerId("");

    setItems([
      {
        productId: "",
        quantity: 1
      }
    ]);

    alert("Invoice Created Successfully");

  })
  .catch((err) => {
    console.log(err);
    alert("Failed to create invoice");
  });
};
const selectedCustomer = customers.find(
(c) => c.id === Number(customerId)
);

const calculateTotals = () => {

let subtotal = 0;
let gst = 0;

items.forEach((item) => {

  const product = products.find(
    (p) => p.id === Number(item.productId)
  );

  if (product) {

    const baseAmount =
      product.sellingPrice * item.quantity;

    const gstAmount =
      (baseAmount * product.gstRate) / 100;

    subtotal += baseAmount;
    gst += gstAmount;
  }
});

return {
  subtotal,
  gst,
  total: subtotal + gst
};

};

const totals = calculateTotals();

return (
  <div className="invoice-page">

    {/* HEADER */}
    <div className="invoice-header">
      <h1>🧾 Invoice Management</h1>
      <p>Create invoices, calculate GST and manage invoice history.</p>
    </div>

    {/* CUSTOMER CARD */}
    <div className="invoice-card">

      <h2>Select Customer</h2>

      <select
        className="customer-select"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
      >
        <option value="">Choose Customer</option>

        {customers.map((customer) => (
          <option
            key={customer.id}
            value={customer.id}
          >
            {customer.customerName}
          </option>
        ))}
      </select>

      {selectedCustomer && (
        <div className="customer-info">

          <div className="info-box">
            <label>Name</label>
            <p>{selectedCustomer.customerName}</p>
          </div>

          <div className="info-box">
            <label>Phone</label>
            <p>{selectedCustomer.phoneNumber}</p>
          </div>

          <div className="info-box">
            <label>Email</label>
            <p>{selectedCustomer.email}</p>
          </div>

          <div className="info-box">
            <label>GST Number</label>
            <p>{selectedCustomer.gstNumber}</p>
          </div>

        </div>
      )}

    </div>

    {/* PRODUCT CARD */}
    <div className="invoice-card">

      <h2>Invoice Items</h2>

      <table className="product-table">

        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>GST %</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {items.map((item, index) => {

            const selectedProduct = products.find(
              (p) => p.id === Number(item.productId)
            );

            const lineTotal =
              selectedProduct
                ? selectedProduct.sellingPrice *
                  item.quantity
                : 0;

            return (
              <tr key={index}>

                <td>

                  <select
                    className="product-select"
                    value={item.productId}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "productId",
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select Product
                    </option>

                    {products.map((product) => (
                      <option
                        key={product.id}
                        value={product.id}
                      >
                        {product.productName}
                      </option>
                    ))}

                  </select>

                </td>

                <td>
                  ₹
                  {selectedProduct?.sellingPrice ||
                    0}
                </td>

                <td>
                  {selectedProduct?.gstRate || 0}%
                </td>

                <td>

                  <input
                    className="qty-input"
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "quantity",
                        e.target.value
                      )
                    }
                  />

                </td>

                <td>
                  ₹{lineTotal.toFixed(2)}
                </td>

                <td>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeItem(index)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>
            );
          })}

        </tbody>

      </table>

      <button
        className="add-btn"
        type="button"
        onClick={addItem}
      >
        + Add Product
      </button>

    </div>

    {/* SUMMARY */}
    <div className="invoice-card">

      <h2>Invoice Summary</h2>

      <div className="summary-grid">

        <div className="summary-box">
          <h3>Subtotal</h3>
          <h2>
            ₹{totals.subtotal.toFixed(2)}
          </h2>
        </div>

        <div className="summary-box">
          <h3>GST Amount</h3>
          <h2>
            ₹{totals.gst.toFixed(2)}
          </h2>
        </div>

        <div className="summary-box grand-total">
          <h3>Grand Total</h3>
          <h2>
            ₹{totals.total.toFixed(2)}
          </h2>
        </div>

      </div>

    </div>

    {/* CREATE BUTTON */}
    <div className="invoice-card">

      <button
        className="create-btn"
        onClick={handleSubmit}
      >
        Generate Invoice
      </button>

    </div>

    {/* HISTORY */}
    <div className="invoice-card">

  <h2>Invoice History</h2>

  <div className="invoice-table-wrapper"> 

    <table className="invoice-history">

      <thead>
        <tr>
          <th>ID</th>
          <th>Customer</th>
          <th>Subtotal</th>
          <th>GST</th>
          <th>Total</th>
          <th>Date</th>
        </tr>
      </thead>

      <tbody>
        {invoices.map((invoice) => (
          <tr key={invoice.id}>
            <td>{invoice.id}</td>
            <td>{invoice.customer?.customerName}</td>
            <td>₹{invoice.subTotal}</td>
            <td>₹{invoice.gstAmount}</td>
            <td>₹{invoice.totalAmount}</td>
            <td>
              {new Date(invoice.invoiceDate).toLocaleString()}
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

export default Invoices;
