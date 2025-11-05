import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function DoctorDashboard() {
  const { token, user: cachedUser, logout } = useAuth();
  const [user, setUser] = useState(cachedUser);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/getUserProfile`, // if VITE_API_URL = http://localhost:8000/api
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
            credentials: "include",
          }
        );
        if (!res.ok) {
          console.error("Profile fetch failed:", res.status, await res.text());
          if (res.status === 401) logout?.();
          return;
        }
        const data = await res.json();
        setUser(data.user || null);
      } catch (e) {
        console.error("Error fetching profile:", e);
      }
    };

    if (token || !token) load();
  }, [token, logout]);

  return (
    <div className="p-8">
      <h1>Welcome, Dr. {user?.name ?? "Guest"}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
