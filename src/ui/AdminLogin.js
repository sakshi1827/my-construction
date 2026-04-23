import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import logo from "../logoa.png";

export default function AdminLogin() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        { username, password },
        { withCredentials: true } // ✅ helps with cookies if used
      );

      console.log("RESPONSE:", res.data);

      // ✅ safer check
      if (res.data && res.data.success === true) {
        alert("Login Successful ✅");

        // save user
        localStorage.setItem("user", JSON.stringify(res.data.user));

        navigate("/dashboard");
      } else {
        alert(res.data?.message || "Invalid Username or Password ❌");
      }

    } catch (err) {
      console.error("ERROR:", err);

      // ✅ better error message
      if (err.response) {
        alert(err.response.data?.message || "Login failed ❌");
      } else {
        alert("Server not responding ❌ (check backend)");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center relative pt-10"
      style={{
        backgroundImage:
          "linear-gradient(rgba(8,28,60,0.9), rgba(8,28,60,0.9)), url('/crane.jpg')",
      }}
    >

      <img 
        src={logo} 
        alt="Logo" 
        style={{ width: "400px", height: "auto", margin: "0px" }}
      />

      <p className="text-gray-200 mb-4 text-center max-w-md">
        Sign in to access your construction management system
      </p>

      <form
        onSubmit={handleLogin}
        autoComplete="off"
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 w-[400px] shadow-2xl"
      >

        {/* USERNAME */}
        <div className="mb-5">
          <label className="block text-gray-200 mb-2">
            Username
          </label>

          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-6">
          <label className="block text-gray-200 mb-2">
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

      </form>

    </div>
  );
}