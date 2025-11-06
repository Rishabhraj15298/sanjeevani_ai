import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const url = `${API}/api/auth/${isRegister ? 'register' : 'login'}`;
      const payload = isRegister ? { name, email, password, role } : { email, password };
      const res = await axios.post(url, payload);
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      nav(user.role === 'doctor' ? '/doctor' : '/patient');
    } catch (err) {
      alert(err?.response?.data?.message || 'Auth error');
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-3">{isRegister ? 'Register' : 'Login'}</h2>
        <form onSubmit={submit} className="space-y-3">
          {isRegister && <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="p-2 border rounded w-full" required />}
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="p-2 border rounded w-full" required />
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="p-2 border rounded w-full" required />
          {isRegister && (
            <select value={role} onChange={e => setRole(e.target.value)} className="p-2 border rounded w-full">
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          )}
          <div className="flex justify-between items-center">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{isRegister ? 'Register' : 'Login'}</button>
            <button type="button" onClick={() => setIsRegister(!isRegister)} className="text-sm text-slate-600">{isRegister ? 'Have an account? Login' : 'Create account'}</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
