import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import api from '../services/api';

export default function AdminSync(){
  const { state } = useAppContext();
  const [apiUrl, setApiUrl] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(()=>{
    try{
      const val = (typeof window !== 'undefined' && window.localStorage) ? localStorage.getItem('FA_API_URL') : '';
      setApiUrl(val || (typeof window !== 'undefined' ? window.__FA_API_URL || '' : ''));
    }catch(e){}
  },[]);

  async function saveUrl(){
    try{
      localStorage.setItem('FA_API_URL', apiUrl);
      setMessage('Saved. Reload page to apply.');
    }catch(e){ setMessage('Failed to save'); }
  }

  async function fetchJobs(){
    setLoading(true);
    try{
      const res = await api.get('/sync/jobs');
      setJobs(res.data.data || []);
    }catch(err){
      setMessage(err?.response?.data?.message || err.message || 'Failed');
    }finally{ setLoading(false); }
  }

  async function triggerSync(){
    setLoading(true);
    setMessage('Running sync...');
    try{
      const res = await api.post('/sync/full');
      setMessage('Sync finished: ' + (res.data?.summary ? JSON.stringify(res.data.summary) : JSON.stringify(res.data)));
      fetchJobs();
    }catch(err){
      setMessage(err?.response?.data?.message || err.message || 'Sync failed');
    }finally{ setLoading(false); }
  }

  return (
    <main>
      <h2>Admin Sync</h2>
      <div>
        <label>Runtime API URL (include /api):</label>
        <input style={{ width: '60%' }} value={apiUrl} onChange={e=>setApiUrl(e.target.value)} />
        <button onClick={saveUrl}>Save</button>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={triggerSync} disabled={!state.authUser || loading}>Run Full Sync</button>
        <button onClick={fetchJobs} disabled={loading} style={{ marginLeft: '1rem' }}>Refresh Jobs</button>
      </div>

      <div style={{ marginTop: '1rem', color: 'green' }}>{message}</div>

      <section style={{ marginTop: '1rem' }}>
        <h3>Recent Jobs</h3>
        {loading ? <div>Loading...</div> : (
          <ul>
            {jobs.map(j => (
              <li key={j._id}>
                <strong>{j.status}</strong> — started: {new Date(j.startedAt).toLocaleString()} — finished: {j.finishedAt ? new Date(j.finishedAt).toLocaleString() : '—'}
                <div>saved: {JSON.stringify(j.saved)}</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>error: {j.error}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
