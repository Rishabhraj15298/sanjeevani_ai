import React, { useState } from 'react';
import axios from 'axios';

export default function PatientForm({ onAdded }) {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const res = await axios.post(
        `${API}/api/patient/reading`,
        {
          systolic: Number(systolic),
          diastolic: Number(diastolic),
          pulse: pulse ? Number(pulse) : undefined,
          symptoms: symptoms ? symptoms.split(',').map(s => s.trim()) : [],
          notes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSystolic(''); setDiastolic(''); setPulse(''); setSymptoms(''); setNotes('');
      onAdded && onAdded(res.data);
    } catch (err) {
      alert(err?.response?.data?.message || 'Error submitting reading');
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <input required value={systolic} onChange={e => setSystolic(e.target.value)} placeholder="Systolic" className="p-2 border rounded" />
        <input required value={diastolic} onChange={e => setDiastolic(e.target.value)} placeholder="Diastolic" className="p-2 border rounded" />
        <input value={pulse} onChange={e => setPulse(e.target.value)} placeholder="Pulse (optional)" className="p-2 border rounded" />
      </div>
      <input value={symptoms} onChange={e => setSymptoms(e.target.value)} placeholder="Symptoms (comma separated)" className="p-2 border rounded w-full" />
      <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes (optional)" className="p-2 border rounded w-full" rows="3" />
      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Submitting...' : 'Submit Reading'}
        </button>
      </div>
    </form>
  );
}
