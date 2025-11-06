import { Link, useNavigate } from "react-router-dom";


export default function Navbar() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login"); // redirect to landing page after logout
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
      <div>
        <button
          onClick={handleLogin}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
        >
          Login
        </button> 
      </div>
    </nav>
  );
}
