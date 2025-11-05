import { useAuth } from "../context/AuthContext";

export default function PatientDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
