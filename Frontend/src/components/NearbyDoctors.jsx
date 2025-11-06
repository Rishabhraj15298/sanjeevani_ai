import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function NearbyDoctors({ speciality='' }) {
  const [state, setState] = useState({ loading: true, items: [], err: '' });

  useEffect(() => {
    let mounted = true;

    function fallback(lat, lon) {
      api.get('/api/providers/nearby', { params: { lat, lon, speciality, km: 10 } })
        .then(res => mounted && setState({ loading:false, items: res.data.providers || [], err:'' }))
        .catch(e => mounted && setState({ loading:false, items:[], err: 'Failed to load nearby doctors' }));
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fallback(pos.coords.latitude, pos.coords.longitude),
        () => fallback(23.2335, 77.4126) // Bhopal fallback
      );
    } else {
      fallback(23.2335, 77.4126);
    }

    return () => { mounted = false; };
  }, [speciality]);

  if (state.loading) return <div className="small text-sub">Finding nearby doctors…</div>;
  if (state.err) return <div className="small text-sub">{state.err}</div>;
  if (!state.items.length) return <div className="small text-sub">No providers found nearby.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      {state.items.map(d => (
        <div key={d._id} className="p-2 rounded-md border" style={{ borderColor: 'var(--line)' }}>
          <div className="font-medium">{d.name}</div>
          <div className="small text-sub">{d.speciality} • {d.address || ''}</div>
          <div className="mt-2 flex gap-2">
            {d.phone && <a className="btn btn-ghost small" href={`tel:${d.phone}`}>Call</a>}
          </div>
        </div>
      ))}
    </div>
  );
}
