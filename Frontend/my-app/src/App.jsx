import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Spline from "@splinetool/react-spline";

import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";

export default function App() {
  return (
    <>
      {/* Header */}

      <Routes>
        {/* 🏠 Home Page */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <div className="h-screen w-full bg-black">
                <Spline scene="https://prod.spline.design/KHbqYuRbUz8oZsP5/scene.splinecode" />
              </div>

              <section className="h-screen bg-[#121212] text-white flex flex-col items-center justify-center text-center">
                <h1 className="text-5xl font-bold mb-4">About Us</h1>
                <p className="text-lg text-gray-300 max-w-2xl">
                  We are passionate creators building next-gen AI and web experiences.
                </p>
              </section>
            </>
          }
        />

        {/* 🔐 Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🧑‍⚕️ Role-Based Dashboards */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      </Routes>
    </>
  );
}
