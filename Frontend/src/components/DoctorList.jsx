import React, { useState } from 'react';
import axios from 'axios';

export default function DoctorList({ aiReports, onApprove }) {
  const [loadingId, setLoadingId] = useState(null);
  const token = localStorage.getItem('token');

  async function approve(id, summary) {
    setLoadingId(id);
    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const res = await axios.post(`${API}/api/doctor/approve/${id}`, { finalSummary: summary, meds: [], doctorNotes: 'Approved via UI' }, { headers: { Authorization: `Bearer ${token}` } });
      onApprove && onApprove(res.data.approved);
    } catch (err) {
      alert(err?.response?.data?.message || 'Error approving');
    } finally { setLoadingId(null); }
  }

  return (
    <div className="space-y-3">
      {aiReports.length === 0 && <div className="text-slate-500">No AI reports yet.</div>}
      {aiReports.map(r => (
        <div key={r.aiReportId || r._id} className="bg-white p-3 rounded shadow">
          <div className="flex justify-between">
            <div>
              <div className="text-sm text-slate-500">Patient: {r.patientName || r.patient?.name || r.patientId}</div>
              <div className="font-medium mt-1">{r.content?.summary}</div>
              <div className="text-sm mt-2">Conditions: {(r.content?.possible_conditions || []).join(', ')}</div>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => approve(r.aiReportId || r._id, (r.content?.summary || '').slice(0, 200))} className="bg-green-600 text-white px-3 py-1 rounded">
                {loadingId === (r.aiReportId || r._id) ? 'Approving...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
