import "../Payment.css";
import { useEffect, useState } from "react";
import { getPayments, createPayment } from "../services/paymentService";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    invoiceId: "",
    amount: "",
    method: "CASH",
    transactionReference: ""
  });

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = () => {
    getPayments()
      .then((res) => setPayments(res.data))
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createPayment({
      invoice: {
        id: Number(form.invoiceId)
      },
      amount: Number(form.amount),
      paymentMethod: form.method,
      transactionReference: form.transactionReference,
      status: "PAID"
    })
      .then(() => {
        loadPayments();

        setForm({
          invoiceId: "",
          amount: "",
          method: "CASH",
          transactionReference: ""
        });

        alert("Payment Added Successfully");
      })
      .catch((err) => {
        console.log(err);
        alert("Failed to Add Payment");
      });
  };

  // KPI Calculations

  const totalPayments = payments.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0
  );

  const cashPayments = payments
    .filter(
      (p) =>
        (p.paymentMethod || p.method) === "CASH"
    )
    .reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );

  const digitalPayments =
    totalPayments - cashPayments;

  const filteredPayments = payments.filter(
    (p) =>
      String(p.invoice?.id || "")
        .includes(search) ||
      String(p.transactionReference || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="payment-page">

      {/* HEADER */}

      <div className="payment-header">
        <h1>💳 Payment Management</h1>
        <p>
          Manage customer payments and
          transaction records.
        </p>
      </div>

      {/* KPI */}

      <div className="payment-kpi-grid">

        <div className="payment-kpi-card">
          <h3>Total Collection</h3>
          <h2>₹{totalPayments}</h2>
        </div>

        <div className="payment-kpi-card">
          <h3>Cash Payments</h3>
          <h2>₹{cashPayments}</h2>
        </div>

        <div className="payment-kpi-card">
          <h3>Digital Payments</h3>
          <h2>₹{digitalPayments}</h2>
        </div>

        <div className="payment-kpi-card">
          <h3>Total Transactions</h3>
          <h2>{payments.length}</h2>
        </div>

      </div>

      {/* PAYMENT ENTRY */}

      <div className="payment-card">

        <h2>Add Payment</h2>

        <form
          className="payment-form-grid"
          onSubmit={handleSubmit}
        >

          <input
            name="invoiceId"
            placeholder="Invoice ID"
            value={form.invoiceId}
            onChange={handleChange}
            required
          />

          <input
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            required
          />

          <select
            name="method"
            value={form.method}
            onChange={handleChange}
          >
            <option value="CASH">
              Cash
            </option>

            <option value="CARD">
              Card
            </option>

            <option value="UPI">
              UPI
            </option>

            <option value="BANK_TRANSFER">
              Bank Transfer
            </option>
          </select>

          <input
            name="transactionReference"
            placeholder="Transaction Reference"
            value={form.transactionReference}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="save-payment-btn"
          >
            Save Payment
          </button>

        </form>

      </div>

      {/* HISTORY */}

      <div className="payment-card">

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "20px"
          }}
        >

          <h2>Payment History</h2>

          <input
            className="search-box"
            placeholder="Search Invoice ID or Reference..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="payment-table-wrapper">

          <table className="payment-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Invoice</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Reference</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>

              {filteredPayments.length > 0 ? (

                filteredPayments.map((p) => (

                  <tr key={p.id}>

                    <td>{p.id}</td>

                    <td>
                      {p.invoice?.id}
                    </td>

                    <td>
                      ₹{p.amount}
                    </td>

                    <td>
                      {p.method ||
                        p.paymentMethod ||
                        p.methodType}
                    </td>

                    <td>
                      {p.transactionReference ||
                        "-"}
                    </td>

                    <td>
                      <span className="status-paid">
                        PAID
                      </span>
                    </td>

                    <td>
                      {p.paymentDate
                        ? new Date(
                            p.paymentDate
                          ).toLocaleString()
                        : "-"}
                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign:
                        "center",
                      padding: "20px"
                    }}
                  >
                    No Payments Found
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

export default Payments;