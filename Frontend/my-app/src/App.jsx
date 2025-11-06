import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import CommonDashboard from "./pages/commonDashboard"; // Import the new common page

export default function App() {
  return (
    <Routes>
      {/* 🏠 Home / Common Dashboard */}
      <Route path="/" element={<CommonDashboard />} />

      {/* 🔐 Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🧑‍⚕️ Role-Based Dashboards */}
      <Route path="/patient/dashboard" element={<PatientDashboard />} />
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
    </Routes>
  );
}
