import { Link, useLocation } from "react-router-dom";
import logo from "../logoa.png";
import {
  FaTachometerAlt,
  FaFolderOpen,
  FaUsers,
  FaUserTie,
  FaClipboardCheck,
  FaBoxes,
  FaDollarSign,
  FaFileAlt
} from "react-icons/fa";

export default function Sidebar() {

  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "Project Details", path: "/projects", icon: <FaFolderOpen /> },
    { name: "Client Management", path: "/clients", icon: <FaUsers /> },
    { name: "Worker Management", path: "/workers", icon: <FaUserTie /> },
    { name: "Attendance Management", path: "/attendance", icon: <FaClipboardCheck /> },
    { name: "Material & expenses Management", path: "/materials", icon: <FaBoxes /> },
    { name: "payments management", path: "/payments", icon: <FaDollarSign /> },
    { name: "Report Generation", path: "/report", icon: <FaFileAlt /> }
  ];

  return (
    <div className="w-72 min-h-screen bg-gradient-to-b from-[#0c2344] to-[#071a33] text-white flex flex-col font-poppins">

      {/* Logo Section */}
      <div className="p-6 text-center border-b border-white/10">

        <img
  src={logo}
  alt="Company Logo"
  className="w-19 mx-auto mb-3"
/>

        

        

        <p className="mt-3 text-base text-gray-300">
          Admin Panel
        </p>

      </div>

      {/* Menu */}
      <div className="flex-1 p-6 space-y-4">

        {menu.map((item) => {

          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-200
              ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >

              <span className="text-xl">
                {item.icon}
              </span>

              <span className="text-base font-medium">
                {item.name}
              </span>

            </Link>
          );
        })}

      </div>

    </div>
  );
}