import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // redirect to landing page after logout
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full p-4 flex items-center justify-between z-50 
                 bg-black/30 backdrop-blur-sm border-b border-white/10 shadow-md"
    >
      {/* Left: Logo */}
      <h1 className="text-xl font-semibold text-white drop-shadow-md">LOGO</h1>

      {/* Center: Menu */}
      <ul className="hidden md:flex gap-6 text-white font-medium">
        <li>
          <a href="#about" className="hover:text-gray-300 transition">
            About
          </a>
        </li>
        <li>
          <a href="#features" className="hover:text-gray-300 transition">
            Features
          </a>
        </li>
        <li>
          <a href="#contact" className="hover:text-gray-300 transition">
            Contact
          </a>
        </li>
      </ul>

      {/* Right: Auth Section */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-white font-medium">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-transparent border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition">
                Sign In
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-transparent border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
