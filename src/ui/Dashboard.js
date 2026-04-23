import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useNavigate } from "react-router-dom";
import { FaProjectDiagram, FaUsers, FaRupeeSign } from "react-icons/fa";

export default function Dashboard() {

  const navigate = useNavigate();

  const [projects, setProjects] = useState(0);
  const [workers, setWorkers] = useState(0);
  const [expenses, setExpenses] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const projectRes = await axios.get("http://localhost:5000/api/projects");
      setProjects(projectRes.data.length);

      const workerRes = await axios.get("http://localhost:5000/api/workers");
      setWorkers(workerRes.data.length);

      const expenseRes = await axios.get("http://localhost:5000/api/expenses");

      let total = 0;
      expenseRes.data.forEach(e => {
        total += Number(e.amount);
      });

      setExpenses(total);

    } catch (err) {
      console.log(err);
    }
  };

  // ✅ RETURN MUST BE INSIDE FUNCTION
  return (
    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Topbar />

        <div className="p-8">

          <h1 className="text-3xl font-bold text-blue-900 mb-6">
            Dashboard Overview
          </h1>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">{projects}</h2>
                <p className="text-gray-500">Total Projects</p>
              </div>
              <FaProjectDiagram className="text-blue-600 text-3xl" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">{workers}</h2>
                <p className="text-gray-500">Total Workers</p>
              </div>
              <FaUsers className="text-orange-500 text-3xl" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">₹{expenses}</h2>
                <p className="text-gray-500">Total Expenses</p>
              </div>
              <FaRupeeSign className="text-orange-500 text-3xl" />
            </div>

          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-xl font-semibold mb-4">
              Quick Actions
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              <button
                onClick={() => navigate("/clients")}
                className="bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
              >
                Add Client
              </button>

              <button
                onClick={() => navigate("/workers")}
                className="bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800"
              >
                Add Worker
              </button>

              <button
                onClick={() => navigate("/attendance")}
                className="border border-blue-900 text-blue-900 py-3 rounded-lg"
              >
                Mark Attendance
              </button>

              <button
                onClick={() => navigate("/expenses")}
                className="border border-orange-500 text-orange-500 py-3 rounded-lg"
              >
                Add Expense
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}