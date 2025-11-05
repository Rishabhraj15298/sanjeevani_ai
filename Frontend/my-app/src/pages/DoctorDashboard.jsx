import { useAuth } from "../context/AuthContext";

export default function DoctorDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <h1>Welcome, Dr. {user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
