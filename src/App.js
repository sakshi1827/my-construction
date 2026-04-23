import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLogin from "./ui/AdminLogin";
import Dashboard from "./ui/Dashboard";

import Projectdetails from "./ui/Projectdetails";
import WorkerManagement from "./ui/WorkerManagement";
import ClientManagement from "./ui/ClientManagement";
import AttendanceManagement from "./ui/AttendanceManagement";
import MaterialManagement from "./ui/MaterialManagement";

import PaymentSystem from "./ui/PaymentSystem";
import ReportGeneration from "./ui/ReportGeneration"; // ✅ FIXED NAME

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH */}
        <Route path="/" element={<AdminLogin />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* MODULES */}
        <Route path="/projects" element={<Projectdetails />} />
        <Route path="/workers" element={<WorkerManagement />} />
        <Route path="/clients" element={<ClientManagement />} />
        <Route path="/attendance" element={<AttendanceManagement />} />
        <Route path="/materials" element={<MaterialManagement />} />

        {/* PAYMENTS */}
        <Route path="/payments" element={<PaymentSystem />} />

        {/* REPORT */}
        <Route path="/report" element={<ReportGeneration />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;