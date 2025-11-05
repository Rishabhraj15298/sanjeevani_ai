import { useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, formData);
      login(res.data);
      const {role}  = res.data.user;
      if (role === "doctor") navigate("/doctor/dashboard");
      else navigate("/patient/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
       <header className="fixed top-0 right-0 p-4 flex items-center gap-4 z-60">
        <Link to="/login">
          <button className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition">
            Login
          </button>
        </Link>

        <Link to="/register">
          <button className="bg-transparent border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition">
            Register
          </button>
        </Link>
      </header>
      <div className="bg-gray-900 p-8 rounded-lg shadow-md w-80 flex flex-col">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white"
          />
          <button
            type="submit"
            className="bg-white text-black font-medium py-2 rounded hover:bg-gray-200 transition-colors"
          >
            Login
          </button>
        </form>
        <p className="text-gray-400 mt-4 text-sm text-center">
          Don't have an account?{" "}
          <span
            className="text-white cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
