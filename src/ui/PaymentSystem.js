import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function PaymentSystem() {

  const [payments, setPayments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState(null);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);

  const maxAmount = 1000000000;

  const [form, setForm] = useState({
    title: "",
    clientName: "",
    projectName: "",
    transactionFlow: "INCOMING",
    paymentType: "MILESTONE",
    milestoneName: "",
    milestonePercent: "",
    totalAmount: "",
    paidAmount: "",
    pendingAmount: "",
    gstPercent: 18,
    tdsPercent: 2,
    paymentDate: "",
    dueDate: "",
    paymentMethod: "UPI",
    transactionId: "",
    createdByRole: "ADMIN",
    supplierName: "",
    workerName: "",
    notes: ""
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/payments")
      .then(r => r.json())
      .then(setPayments);
  }, []);

  // ================= HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    const charFields = ["title", "clientName", "projectName", "milestoneName"];

    if (charFields.includes(name)) {
      const charRegex = /^[A-Za-z\s]*$/;
      if (!charRegex.test(value)) return;
      setForm(prev => ({ ...prev, [name]: value }));
      return;
    }

    if (name === "totalAmount" || name === "paidAmount") {
      if (isNaN(value)) return;
      if (Number(value) > maxAmount) return;

      let updated = { ...form, [name]: value };

      const total = name === "totalAmount" ? value : form.totalAmount;
      const paid = name === "paidAmount" ? value : form.paidAmount;

      updated.pendingAmount = Number(total || 0) - Number(paid || 0);

      setForm(updated);
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  // ================= STATUS
  const getStatus = (total, paid) => {
    if (Number(paid) === 0) return "PENDING";
    if (Number(paid) >= Number(total)) return "PAID";
    return "PARTIAL";
  };

  // ================= DATE VALIDATION
  const validateDates = () => {
    if (!form.paymentDate || !form.dueDate) {
      alert("Please select both Payment Date and Due Date");
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const paymentDate = new Date(form.paymentDate);
    const dueDate = new Date(form.dueDate);

    if (isNaN(paymentDate.getTime()) || isNaN(dueDate.getTime())) {
      alert("Invalid date selected");
      return false;
    }

    if (paymentDate <= today) {
      alert("Payment date must be AFTER today");
      return false;
    }

    const minDue = new Date(paymentDate);
    minDue.setMonth(minDue.getMonth() + 1);

    if (dueDate < minDue) {
      alert("Due date must be at least 1 month after payment date");
      return false;
    }

    return true;
  };

  // ================= SAVE (CREATE + UPDATE)
  const savePayment = async (e) => {
    e.preventDefault();

    if (!validateDates()) return;

    try {
      const fd = new FormData();

      const status = getStatus(form.totalAmount, form.paidAmount);

      Object.keys(form).forEach((key) => {
        fd.append(key, form[key]);
      });

      fd.append("status", status);

      if (file) fd.append("invoice", file);

      const url = editingId
        ? `http://localhost:5000/api/payments/${editingId}`
        : "http://localhost:5000/api/payments";

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: fd
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.log(errorText);
        alert("Payment not saved");
        return;
      }

      const data = await res.json();

      if (editingId) {
        setPayments(prev =>
          prev.map(p =>
            p.id === editingId ? { ...form, id: editingId, status } : p
          )
        );
      } else {
        setPayments(prev => [
          ...prev,
          { ...form, id: data.id, status }
        ]);
      }

      // RESET FORM
      setForm({
        title: "",
        clientName: "",
        projectName: "",
        transactionFlow: "INCOMING",
        paymentType: "MILESTONE",
        milestoneName: "",
        milestonePercent: "",
        totalAmount: "",
        paidAmount: "",
        pendingAmount: "",
        gstPercent: 18,
        tdsPercent: 2,
        paymentDate: "",
        dueDate: "",
        paymentMethod: "UPI",
        transactionId: "",
        createdByRole: "ADMIN",
        supplierName: "",
        workerName: "",
        notes: ""
      });

      setEditingId(null);
      setFile(null);
      setShowForm(false);

    } catch (error) {
      console.error(error);
      alert("Error saving payment");
    }
  };

  // ================= EDIT
  const handleEdit = (payment) => {
    setForm(payment);
    setEditingId(payment.id);
    setShowForm(true);
  };

  // ================= DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/payments/${id}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        alert("Delete failed");
        return;
      }

      setPayments(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting payment");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1 p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">

          <h1 className="text-2xl font-bold">
            Payment Management Dashboard
          </h1>

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-1/3"
          />

          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
            }}
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            + Create Payment
          </button>

        </div>

        {/* FORM (UNCHANGED) */}
        {showForm && (
          <form
            onSubmit={savePayment}
            className="bg-white p-6 mt-4 grid grid-cols-2 gap-4 rounded shadow"
          >

            <div>
              <label>Payment Title</label>
              <input name="title" onChange={handleChange} className="border p-2 w-full rounded" />
            </div>

            <div>
              <label>Client Name</label>
              <input name="clientName" onChange={handleChange} className="border p-2 w-full rounded" />
            </div>

            <div>
              <label>Project Name</label>
              <input name="projectName" onChange={handleChange} className="border p-2 w-full rounded" />
            </div>

            <div>
              <label>Transaction Flow</label>
              <select name="transactionFlow" onChange={handleChange} className="border p-2 w-full rounded">
                <option>INCOMING</option>
                <option>OUTGOING</option>
              </select>
            </div>

            <div>
              <label>Payment Type</label>
              <select name="paymentType" onChange={handleChange} className="border p-2 w-full rounded">
                <option>MILESTONE</option>
                <option>ADVANCE</option>
                <option>FINAL</option>
                <option>SALARY</option>
                <option>MATERIAL</option>
              </select>
            </div>

            <div>
              <label>Milestone Name</label>
              <input name="milestoneName" onChange={handleChange} className="border p-2 w-full rounded" />
            </div>

            <div>
              <label>Total Amount</label>
              <input name="totalAmount" onChange={handleChange} className="border p-2 w-full rounded" />
            </div>

            <div>
              <label>Paid Amount</label>
              <input name="paidAmount" onChange={handleChange} className="border p-2 w-full rounded" />
            </div>

            <div>
              <label>Pending Amount</label>
              <input value={form.pendingAmount} readOnly className="border p-2 w-full rounded bg-gray-100" />
            </div>

            <div>
              <label>Payment Date</label>
              <input type="date" name="paymentDate" onChange={handleChange} className="border p-2 w-full rounded" />
            </div>

            <div>
              <label>Due Date</label>
              <input type="date" name="dueDate" onChange={handleChange} className="border p-2 w-full rounded" />
            </div>

            <div>
              <label>Invoice</label>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            </div>

            <div className="col-span-2 flex gap-3">

              <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">
                {editingId ? "Update Payment" : "Save Payment"}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>

            </div>

          </form>
        )}

        {/* TABLE */}
        <div className="mt-6 bg-white p-4">

          <table className="w-full border">

            <thead>
              <tr>
                <th>ID</th>
                <th>Project</th>
                <th>Client</th>
                <th>Type</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Pending</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p, i) => (
                <tr key={i} className="text-center border-t">

                  <td>{p.id}</td>
                  <td>{p.projectName}</td>
                  <td>{p.clientName}</td>
                  <td>{p.paymentType}</td>
                  <td>₹{p.totalAmount}</td>
                  <td>₹{p.paidAmount}</td>
                  <td>₹{p.pendingAmount}</td>

                  <td>
                    <span className="bg-blue-600 text-white px-2 py-1 rounded">
                      {p.status}
                    </span>
                  </td>

                  <td className="flex gap-2 justify-center">

                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>

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