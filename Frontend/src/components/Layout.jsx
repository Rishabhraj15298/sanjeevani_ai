import React from 'react';
import { Link } from 'react-router-dom';

export default function Layout({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  }

  return (
    <div>
      <header className="bg-white shadow p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="font-bold text-xl">BP Tracker — MVP</h1>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-slate-600 text-sm">Home</Link>
            {user && user.role === 'patient' && <Link to="/patient" className="text-slate-600 text-sm">Patient</Link>}
            {user && user.role === 'doctor' && <Link to="/doctor" className="text-slate-600 text-sm">Doctor</Link>}
            {user ? <button onClick={logout} className="text-sm text-red-600">Logout</button> : null}
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-4">{children}</main>
    </div>
  );
}
