import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function MaterialExpenseManagement() {

  const today = new Date().toISOString().split("T")[0];
  const onlyChars = /^[A-Za-z\s]+$/;

  const [activeForm, setActiveForm] = useState("");
  const [materials, setMaterials] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [materialForm, setMaterialForm] = useState({
    name: "",
    quantity: "",
    unit: "Kg",
    supplier: "",
    purchaseDate: today,
    costPerUnit: "",
    totalCost: "",
    invoice: "",
    stock: "",
    remarks: ""
  });

  const [expenseForm, setExpenseForm] = useState({
    title: "",
    category: "Labor",
    amount: "",
    paymentMethod: "Cash",
    date: today,
    vendor: "",
    bill: "",
    description: ""
  });

  // ================= LOAD =================
  useEffect(() => {
    fetchMaterials();
    fetchExpenses();
  }, []);

  const fetchMaterials = async () => {
    const res = await fetch("http://localhost:5000/api/materials");
    const data = await res.json();
    setMaterials(data || []);
  };

  const fetchExpenses = async () => {
    const res = await fetch("http://localhost:5000/api/expenses");
    const data = await res.json();
    setExpenses(data || []);
  };

  // ================= AUTO TOTAL =================
  useEffect(() => {
    const total =
      (Number(materialForm.quantity) || 0) *
      (Number(materialForm.costPerUnit) || 0);

    setMaterialForm((prev) => ({ ...prev, totalCost: total }));
  }, [materialForm.quantity, materialForm.costPerUnit]);

  // ================= HANDLERS =================
  const handleMaterialChange = (e) => {
    const { name, value } = e.target;

    if ((name === "name" || name === "supplier") && value && !onlyChars.test(value)) {
      return alert("Only characters allowed");
    }

    if (name === "purchaseDate" && value > today) {
      return alert("Future date not allowed");
    }

    setMaterialForm({ ...materialForm, [name]: value });
  };

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;

    if ((name === "title" || name === "vendor") && value && !onlyChars.test(value)) {
      return alert("Only characters allowed");
    }

    if (name === "amount" && Number(value) > 1000000000) {
      return alert("Max ₹10 Cr allowed");
    }

    if (name === "date" && value > today) {
      return alert("Future date not allowed");
    }

    setExpenseForm({ ...expenseForm, [name]: value });
  };

  // ================= SAVE =================
  const addMaterial = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(materialForm)
    });

    fetchMaterials();
    setActiveForm("");
  };

  const addExpense = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expenseForm)
    });

    fetchExpenses();
    setActiveForm("");
  };

  const totalMaterialCost = materials.reduce(
    (s, m) => s + Number(m.totalCost || 0), 0
  );

  const totalExpenseCost = expenses.reduce(
    (s, e) => s + Number(e.amount || 0), 0
  );

  return (
    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 p-8">

        {/* ================= DASHBOARD ================= */}
        {activeForm === "" && (
          <>
            <h1 className="text-3xl font-bold mb-6">
              Material & Expense Dashboard
            </h1>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded shadow">
                Total Material Cost <h2>₹{totalMaterialCost}</h2>
              </div>

              <div className="bg-white p-6 rounded shadow">
                Total Expenses <h2>₹{totalExpenseCost}</h2>
              </div>

              <div className="bg-white p-6 rounded shadow">
                Total Records <h2>{materials.length + expenses.length}</h2>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setActiveForm("material")} className="bg-orange-500 text-white px-5 py-2 rounded">
                + Material Form
              </button>

              <button onClick={() => setActiveForm("expense")} className="bg-blue-500 text-white px-5 py-2 rounded">
                + Expense Form
              </button>
            </div>

            {/* LISTS */}
            <div className="grid grid-cols-2 gap-6 mt-8">

              <div>
                <h2>Material List</h2>
                <table className="w-full bg-white">
                  <tbody>
                    {materials.map((m) => (
                      <tr key={m.id}>
                        <td>{m.name}</td>
                        <td>{m.quantity}</td>
                        <td>₹{m.totalCost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <h2>Expense List</h2>
                <table className="w-full bg-white">
                  <tbody>
                    {expenses.map((e) => (
                      <tr key={e.id}>
                        <td>{e.title}</td>
                        <td>₹{e.amount}</td>
                        <td>{e.paidTo || e.vendor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </>
        )}

        {/* ================= MATERIAL FORM ================= */}
        {activeForm === "material" && (
          <form onSubmit={addMaterial} className="bg-white p-6 mt-6">

            <h2 className="text-xl font-bold mb-4">Material Form</h2>

            {/* Row 1 */}
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div>
                <label>Material Name</label>
                <input name="name" onChange={handleMaterialChange} className="border p-2 w-full" />
              </div>

              <div>
                <label>Quantity</label>
                <input name="quantity" onChange={handleMaterialChange} className="border p-2 w-full" />
              </div>

              <div>
                <label>Unit</label>
                <select name="unit" onChange={handleMaterialChange} className="border p-2 w-full">
                  <option>Kg</option>
                  <option>Pcs</option>
                  <option>Bags</option>
                  <option>Ton</option>
                  <option>Liter</option>
                </select>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div>
                <label>Supplier</label>
                <input name="supplier" onChange={handleMaterialChange} className="border p-2 w-full" />
              </div>

              <div>
                <label>Purchase Date</label>
                <input type="date" name="purchaseDate" value={materialForm.purchaseDate} onChange={handleMaterialChange} className="border p-2 w-full" />
              </div>

              <div>
                <label>Unit Price</label>
                <input name="costPerUnit" onChange={handleMaterialChange} className="border p-2 w-full" />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div>
                <label>Total Cost</label>
                <input value={materialForm.totalCost} readOnly className="border p-2 bg-gray-100 w-full" />
              </div>

              <div>
                <label>Invoice</label>
                <input name="invoice" onChange={handleMaterialChange} className="border p-2 w-full" />
              </div>

              <div>
                <label>Stock</label>
                <input name="stock" onChange={handleMaterialChange} className="border p-2 w-full" />
              </div>
            </div>

            {/* Row 4 */}
            <div>
              <label>Remarks</label>
              <textarea name="remarks" onChange={handleMaterialChange} className="border p-2 w-full mb-3" />
            </div>

            <button className="bg-green-500 text-white px-4 py-2">Save</button>
            <button type="button" onClick={() => setActiveForm("")} className="ml-3">Back</button>

          </form>
        )}

        {/* ================= EXPENSE FORM ================= */}
        {activeForm === "expense" && (
          <form onSubmit={addExpense} className="bg-white p-6 mt-6">

            <h2 className="text-xl font-bold mb-4">Expense Form</h2>

            {/* Row 1 */}
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div>
                <label>Expense Title</label>
                <input name="title" onChange={handleExpenseChange} className="border p-2 w-full" />
              </div>

              <div>
                <label>Category</label>
                <select name="category" onChange={handleExpenseChange} className="border p-2 w-full">
                  <option>Labor</option>
                  <option>Maintenance</option>
                  <option>Transport</option>
                  <option>Equipment</option>
                  <option>Material Purchase</option>
                  <option>Office Expense</option>
                  <option>Miscellaneous</option>
                </select>
              </div>

              <div>
                <label>Amount</label>
                <input name="amount" onChange={handleExpenseChange} className="border p-2 w-full" />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div>
                <label>Payment Method</label>
                <select name="paymentMethod" onChange={handleExpenseChange} className="border p-2 w-full">
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Bank Transfer</option>
                  <option>Cheque</option>
                  <option>Card</option>
                </select>
              </div>

              <div>
                <label>Date</label>
                <input type="date" name="date" value={expenseForm.date} onChange={handleExpenseChange} className="border p-2 w-full" />
              </div>

              <div>
                <label>Vendor</label>
                <input name="vendor" onChange={handleExpenseChange} className="border p-2 w-full" />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label>Bill Number</label>
                <input name="bill" onChange={handleExpenseChange} className="border p-2 w-full" />
              </div>

              <div>
                <label>Upload Bill</label>
                <input type="file" className="border p-2 w-full" />
              </div>
            </div>

            {/* Row 4 */}
            <div>
              <label>Description</label>
              <textarea name="description" onChange={handleExpenseChange} className="border p-2 w-full mb-3" />
            </div>

            <button className="bg-blue-500 text-white px-4 py-2">Save</button>
            <button type="button" onClick={() => setActiveForm("")} className="ml-3">Back</button>

          </form>
        )}

      </div>
    </div>
  );
}