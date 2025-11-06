import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import PatientForm from '../components/PatientForm';
import axios from 'axios';
import { createSocket, getSocket, disconnectSocket } from '../lib/socket';

export default function PatientPage() {
  const [readings, setReadings] = useState([]);
  const [approvedReports, setApprovedReports] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/'; return; }
    createSocket(token);
    const s = getSocket();
    s.on('report:approved', (data) => {
      setApprovedReports(prev => [data, ...prev]);
      alert('Your report has been approved by doctor.');
    });
    return () => { try { s.off(); disconnectSocket(); } catch (e) {} };
  }, []);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token');
      const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const r = await axios.get(`${API}/api/patient/readings`, { headers: { Authorization: `Bearer ${token}` } });
      setReadings(r.data.readings || []);
      const a = await axios.get(`${API}/api/patient/approved-reports`, { headers: { Authorization: `Bearer ${token}` } });
      setApprovedReports(a.data.approved || []);
    }
    fetchData();
  }, []);

  return (
    <Layout>
      <h2 className="text-lg font-semibold mb-3">Patient Dashboard</h2>
      <PatientForm onAdded={(r) => setReadings(prev => [r.reading, ...prev])} />
      <section className="mt-6">
        <h3 className="font-medium mb-2">Recent Readings</h3>
        <div className="space-y-2">
          {readings.map(r => (
            <div key={r._id} className="bg-white p-3 rounded shadow">
              <div className="text-sm text-slate-500">{new Date(r.measuredAt).toLocaleString()}</div>
              <div className="font-medium mt-1">{r.systolic}/{r.diastolic} mmHg</div>
              <div className="text-sm mt-1">Pulse: {r.pulse || '—'}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h3 className="font-medium mb-2">Approved Reports</h3>
        <div className="space-y-2">
          {approvedReports.map(a => (
            <div key={a._id || a.approvedId} className="bg-white p-3 rounded shadow">
              <div className="text-sm text-slate-500">Approved: {new Date(a.approvedAt || a.approvedAt).toLocaleString()}</div>
              <div className="font-medium mt-1">{a.finalSummary}</div>
              <div className="text-sm mt-2">Meds: {(a.meds || []).join(', ')}</div>
              <div className="text-sm mt-2">Doctor Notes: {a.doctorNotes}</div>
            </div>
          ))}
          {!approvedReports.length && <div className="text-slate-500">No approved reports yet.</div>}
        </div>
      </section>
    </Layout>
  );
}
