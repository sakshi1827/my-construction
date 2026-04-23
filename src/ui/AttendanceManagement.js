import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AttendanceManagement() {

  const [workers, setWorkers] = useState([]);
  const [attendance, setAttendance] = useState({});

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchWorkers();
  }, []);

  // ================= FETCH WORKERS
  const fetchWorkers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/workers");

      let data = [];

      if (Array.isArray(res.data)) data = res.data;
      else if (res.data?.data) data = res.data.data;
      else if (res.data?.workers) data = res.data.workers;

      const formatted = data.map((w, index) => ({
        id: w.id || w._id || index,
        name: w.name || "No Name",
        category: w.category || "Worker",
      }));

      setWorkers(formatted);

    } catch (err) {
      console.log("Error fetching workers:", err);
    }
  };

  // ================= TOGGLE PRESENT
  const handleStatusChange = (workerId) => {
    setAttendance((prev) => ({
      ...prev,
      [workerId]: prev[workerId] === "Present" ? "Absent" : "Present",
    }));
  };

  // ================= SELECT ALL
  const handleSelectAll = () => {
    const allPresent = {};
    workers.forEach(w => {
      allPresent[w.id] = "Present";
    });
    setAttendance(allPresent);
  };

  // ================= CLEAR ALL
  const handleClearAll = () => {
    setAttendance({});
  };

  // ================= SAVE ATTENDANCE
  const handleSave = async () => {

    const payload = workers.map((worker) => ({
      worker_id: worker.id,
      status: attendance[worker.id] || "Absent",
      date: today
    }));

    try {
      await axios.post("http://localhost:5000/api/attendance", payload);

      alert("✅ Attendance Saved Successfully");

      // reset after save
      setAttendance({});

    } catch (err) {
      console.log(err);
      alert("❌ Error saving attendance");
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Topbar />

        <div className="p-8">

          <h1 className="text-3xl font-bold mb-6">
            Attendance Management ({today})
          </h1>

          <div className="bg-white rounded-xl shadow p-6">

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 mb-4">
              <button
                onClick={handleSelectAll}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Select All
              </button>

              <button
                onClick={handleClearAll}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Clear All
              </button>
            </div>

            <table className="w-full">

              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Name</th>
                  <th className="text-center">Type</th>
                  <th className="text-center">Present</th>
                </tr>
              </thead>

              <tbody>
                {workers.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-6">
                      No Workers Found
                    </td>
                  </tr>
                ) : (
                  workers.map((worker) => (
                    <tr key={worker.id} className="border-b">

                      <td className="py-3">{worker.name}</td>

                      <td className="text-center">
                        {worker.category}
                      </td>

                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={attendance[worker.id] === "Present"}
                          onChange={() => handleStatusChange(worker.id)}
                        />
                      </td>

                    </tr>
                  ))
                )}
              </tbody>

            </table>

            <button
              onClick={handleSave}
              className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-xl"
            >
              Save Attendance
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}