import React, { useEffect, useState } from 'react';

export default function ApproveModal({ open=false, aiContent={}, onClose=()=>{}, onSubmit=(f)=>{} }) {
  const [finalSummary, setFinalSummary] = useState('');
  const [meds, setMeds] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) {
      setFinalSummary(aiContent?.prediction || aiContent?.summary || '');
      const m = (aiContent?.suggested_medicines || []).join(', ');
      setMeds(m);
      setNotes(aiContent?.medicine_rationale || '');
    } else {
      setFinalSummary(''); setMeds(''); setNotes('');
    }
  }, [open, aiContent]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background:'rgba(2,6,23,0.6)'}}>
      <div className="w-full max-w-lg mx-4 card">
        <div className="font-semibold mb-2">Approve & Edit</div>
        <div className="space-y-2">
          <div>
            <div className="label">Final summary</div>
            <textarea className="textarea" rows={3} value={finalSummary} onChange={e=>setFinalSummary(e.target.value)} />
          </div>
          <div>
            <div className="label">Medicines (comma separated)</div>
            <input className="input" value={meds} onChange={e=>setMeds(e.target.value)} />
          </div>
          <div>
            <div className="label">Doctor notes</div>
            <textarea className="textarea" rows={3} value={notes} onChange={e=>setNotes(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-3">
          <button className="btn btn-ghost small" onClick={onClose}>Cancel</button>
          <button className="btn btn-ok small" onClick={() => onSubmit({
            finalSummary,
            meds: meds.split(',').map(s=>s.trim()).filter(Boolean),
            doctorNotes: notes
          })}>Approve</button>
        </div>
      </div>
    </div>
  );
}
