import { useState } from "react";
import Sidebar from "./Sidebar";
import { generateReport } from "./report";
import { FaFileAlt } from "react-icons/fa";

const reportCategories = {
  "Clients Report": ["All Clients", "Active Clients", "Pending Clients"],
  "Project Report": ["All Projects", "Ongoing", "Completed"],
  "Attendance Report": ["All Attendance", "Present", "Absent"],
  "Material Report": ["All Materials", "Stock In", "Stock Out"],
  "Payment Report": ["All Payments", "Paid", "Pending"],
};

export default function ReportGeneration() {
  const [form, setForm] = useState({
    type: "Clients Report",
    category: "All Clients",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;

    setForm({
      ...form,
      type,
      category: reportCategories[type][0],
    });
  };

  const handleGenerate = (e) => {
  e.preventDefault();

  if (!form.startDate || !form.endDate) {
    alert("Please select start and end date");
    return;
  }

  if (new Date(form.endDate) < new Date(form.startDate)) {
    alert("End date must be after start date");
    return;
  }

  try {
    generateReport(form);
  } catch (err) {
    console.error(err);
    alert("Error generating report");
  }
};

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold">Report Generation</h1>
        <p className="text-gray-500 mb-6">
          Generate detailed reports for analysis
        </p>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-6">
            Configure Report
          </h2>

          <form onSubmit={handleGenerate} className="grid grid-cols-2 gap-6">

            {/* TYPE */}
            <div>
              <label className="text-sm text-gray-600">Report Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleTypeChange}
                className="w-full border p-3 rounded-lg mt-1"
              >
                {Object.keys(reportCategories).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>

            {/* CATEGORY */}
            <div>
              <label className="text-sm text-gray-600">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg mt-1"
              >
                {reportCategories[form.type].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* START DATE */}
            <div>
              <label className="text-sm text-gray-600">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg mt-1"
              />
            </div>

            {/* END DATE */}
            <div>
              <label className="text-sm text-gray-600">End Date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg mt-1"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="flex items-center gap-2 bg-orange-500 text-white px-5 py-3 rounded-lg w-48 hover:bg-orange-600"
            >
              <FaFileAlt />
              Generate
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}