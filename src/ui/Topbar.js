import { FaBell, FaUserCircle } from "react-icons/fa";

export default function Topbar() {
  return (
    <div className="flex items-center justify-between bg-white px-8 py-4 shadow-sm">

      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
      />

      {/* Right Side */}
      <div className="flex items-center gap-6">

        <FaBell className="text-xl text-gray-600 cursor-pointer" />

        <FaUserCircle className="text-2xl text-blue-900 cursor-pointer" />

      </div>

    </div>
  );
}