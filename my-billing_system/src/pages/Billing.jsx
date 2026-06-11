import { useEffect, useState } from "react";
import axios from "axios";
import "../billing.css";

const API_URL = import.meta.env.VITE_API_URL;

function Billing() {

  // ================= STATE =================
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerResults, setCustomerResults] = useState([]);

  const [productResultsMap, setProductResultsMap] = useState({});

  const [customerId, setCustomerId] = useState("");

  const [isNewCustomer, setIsNewCustomer] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    customerName: "",
    phoneNumber: "",
    email: "",
    address: "",
    gstNumber: ""
  });

 const [items, setItems] = useState([
  {
    productId: "",
    productName: "",
    searchText: "",
    quantity: 1,
    price: 0
  }
]);

  const [paymentMethod, setPaymentMethod] = useState("");
const [paymentStatus, setPaymentStatus] = useState("");
  const [transactionReference, setTransactionReference] = useState("");

  const [billResponse, setBillResponse] = useState(null);

  // ================= LOAD =================
  useEffect(() => {
    axios
    .get(`${API_URL}/api/customer`)
    .catch((err) => console.log(err));

  axios
    .get(`${API_URL}/api/product`)
    .catch((err) => console.log(err));

  }, []);

  // ================= CUSTOMER SEARCH =================
  const searchCustomer = async (keyword) => {
    setCustomerSearch(keyword);

    if (!keyword.trim()) {
      setCustomerResults([]);
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL;

const res = await axios.get(
  `${API_URL}/api/customer/search?keyword=${keyword}`
);
    setCustomerResults(res.data);
  };

  // ================= PRODUCT SEARCH =================
  const searchProduct = async (keyword, index) => {
    if (!keyword.trim()) {
      setProductResultsMap(prev => ({ ...prev, [index]: [] }));
      return;
    }

    const res = await axios.get(
  `${API_URL}/api/product/search?keyword=${keyword}`
);

    setProductResultsMap(prev => ({
      ...prev,
      [index]: res.data
    }));
  };

  // ================= ITEM =================
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
      productName: "",
      searchText: "",
      quantity: 1,
      price: 0
    }
  ]);
};

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const getTotal = () =>
    items.reduce((sum, i) => sum + (i.quantity * i.price), 0);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      customerId: isNewCustomer ? null : Number(customerId),

      customerName: isNewCustomer ? newCustomer.customerName : null,
      phoneNumber: isNewCustomer ? newCustomer.phoneNumber : null,
      email: isNewCustomer ? newCustomer.email : null,
      address: isNewCustomer ? newCustomer.address : null,
      gstNumber: isNewCustomer ? newCustomer.gstNumber : null,

      items: items.map(i => ({
        productId: Number(i.productId),
        quantity: Number(i.quantity)
      })),

      paymentMethod,
      transactionReference,
      paymentStatus
    };

   const res = await axios.post(
  `${API_URL}/api/billing/generate`,
  payload
);

    setBillResponse(res.data);

    // reset
    setCustomerSearch("");
    setCustomerResults([]);
    setCustomerId("");
    setIsNewCustomer(false);

    setNewCustomer({
      customerName: "",
      phoneNumber: "",
      email: "",
      address: "",
      gstNumber: ""
    });

    setItems([{ productId: "", productName: "", searchText: "", quantity: 1, price: 0 }]);
  };

  const subtotal = items.reduce(
  (sum, item) =>
    sum + item.price * item.quantity,
  0
);

const gstAmount = subtotal * 0.18;

const totalAmount = subtotal + gstAmount;

  return (
    <div className="billing-wrapper">

      {/* HEADER */}
      <div className="billing-header">
        <h1>Billing System</h1>
      </div>

      <div className="billing-grid">

        {/* ================= CUSTOMER ================= */}
        <div className="card">

          <h2>Customer</h2>

          <input
            className="input"
            placeholder="Search customer..."
            value={customerSearch}
            onChange={(e) => searchCustomer(e.target.value)}
          />

          {/* CUSTOMER DROPDOWN TABLE */}
          {customerResults.length > 0 && (
            <div className="dropdown scroll-table">

              {customerResults.map(c => (
                <div
                  key={c.id}
                  className="dropdown-item table-row"
                  onClick={() => {
                    setCustomerId(c.id);
                    setCustomerSearch(c.customerName);
                    setCustomerResults([]);
                  }}
                >
                  <span>{c.customerName}</span>
                  <span>{c.phoneNumber}</span>
                </div>
              ))}

            </div>
          )}

          <button
            className="btn"
            type="button"
            onClick={() => setIsNewCustomer(!isNewCustomer)}
          >
            {isNewCustomer ? "Select Existing" : "+ New Customer"}
          </button>

          {/* NEW CUSTOMER FORM */}
          {isNewCustomer && (
            <div className="form-grid">

              <input placeholder="Customer Name"
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, customerName: e.target.value })
                }
              />

              <input placeholder="Phone Number"
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phoneNumber: e.target.value })
                }
              />

              <input placeholder="Email"
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, email: e.target.value })
                }
              />

              <input placeholder="Address"
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, address: e.target.value })
                }
              />

              <input placeholder="GST Number"
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, gstNumber: e.target.value })
                }
              />

            </div>
          )}

        </div>

        {/* ================= PRODUCTS ================= */}
        <div className="card">

          <h2>Products</h2>

          {items.map((item, index) => (
            <div className="product-row">

  <div className="product-search">

   <input
  placeholder="Search product..."
  value={item.searchText}
  onChange={(e) => {
    handleItemChange(index, "searchText", e.target.value);
    searchProduct(e.target.value, index);
  }}
/>

    {productResultsMap[index]?.length > 0 && (
      <div className="dropdown scroll-table">

        {productResultsMap[index].map(p => (
          <div
            key={p.id}
            className="dropdown-item table-row"
            onClick={() => {
              const updated = [...items];
              updated[index].productId = p.id;
updated[index].productName = p.productName;
updated[index].searchText = p.productName;
updated[index].price = p.sellingPrice;
              setItems(updated);

              setProductResultsMap(prev => ({
                ...prev,
                [index]: []
              }));
            }}
          >
            <span>{p.productName}</span>
            <span>₹{p.sellingPrice}</span>
          </div>
        ))}

      </div>
    )}

  </div>

  <input
    type="number"
    min="1"
    value={item.quantity}
    onChange={(e) =>
      handleItemChange(index, "quantity", e.target.value)
    }
  />

  <button
    className="remove-btn"
    onClick={() => removeItem(index)}
  >
    X
  </button>

</div>
          ))}

          <button className="btn" onClick={addItem}>
            + Add Item
          </button>

        </div>

      </div>

        {/* ================= SUMMARY ================= */}
        <div className="card summary-card">

  <h2>Invoice Summary</h2>

  <div className="summary-table-wrapper">

    <table className="summary-table">

      <thead>
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Amount</th>
          <th>GST</th>
        </tr>
      </thead>

      <tbody>

        {items.map((item, index) => (

          <tr key={index}>
            <td>{item.productName}</td>

            <td>{item.quantity}</td>

            <td>
              ₹
              {(
                item.price *
                item.quantity
              ).toFixed(2)}
            </td>

            <td>
              ₹
              {(
                item.price *
                item.quantity *
                0.18
              ).toFixed(2)}
            </td>
          </tr>

        ))}

      </tbody>

    </table>

  </div>

  <div className="summary-totals">

    <div className="total-box">
      <span>Subtotal</span>
      <h3>₹{subtotal.toFixed(2)}</h3>
    </div>

    <div className="total-box">
      <span>GST Amount</span>
      <h3>₹{gstAmount.toFixed(2)}</h3>
    </div>

    <div className="total-box grand-total">
      <span>Total Amount</span>
      <h3>₹{totalAmount.toFixed(2)}</h3>
    </div>

  </div>


</div>

      {/* ================= PAYMENT SECTION (STEP UI) ================= */}
      <div className="card payment-box">

  <h2>Payment Details</h2>

  <div className="payment-step">

    <label>Payment Method</label>

    <select
  value={paymentMethod}
  onChange={(e) => setPaymentMethod(e.target.value)}
>
  <option value="" disabled>
    Select Payment Method
  </option>
  <option value="CASH">Cash</option>
  <option value="UPI">UPI</option>
  <option value="CARD">Card</option>
  <option value="BANK_TRANSFER">Bank Transfer</option>
</select>

  </div>

  <div className="payment-step">

    <label>Transaction Reference</label>

    <input
  placeholder="Enter Transaction Reference"
  value={transactionReference}
  onChange={(e) =>
    setTransactionReference(e.target.value)
  }
/>

  </div>

  <div className="payment-step">

    <label>Status</label>

   <select
  value={paymentStatus}
  onChange={(e) =>
    setPaymentStatus(e.target.value)
  }
>
  <option value="" disabled>
    Select Status
  </option>
  <option value="PAID">Paid</option>
  <option value="PENDING">Pending</option>
  <option value="FAILED">Failed</option>
</select>

  </div>

  <button
    className="generate-btn"
    onClick={handleSubmit}
  >
    Generate Invoice
  </button>

</div>


      {/* ================= RESULT ================= */}
      {billResponse && (
        <div className="card success">

          <h2>Invoice Generated</h2>

          <p>Invoice ID: {billResponse.invoiceId}</p>
          <p>Total: ₹{billResponse.totalAmount}</p>

          <a
            href={`${API_URL}/api/invoices/${billResponse.invoiceId}/pdf`}
            target="_blank"
          >
            Download PDF
          </a>

        </div>
      )}

    </div>
  );
}

export default Billing;