import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { fetchDrives } from '../services/api';

export default function Drives() {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    const loadDrives = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const res = await fetchDrives();
        dispatch({ type: 'SET_DRIVES', payload: res.data.data || [] });
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.response?.data?.message || err.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    loadDrives();
  }, [dispatch]);

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }} data-testid="drives-page">
      <h1>Drives</h1>
      {state.loading && <p>Loading drives...</p>}
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
      {state.drives.length === 0 && !state.loading ? <p>No drives found.</p> : (
        <ul>
          {state.drives.map((drive) => (
            <li key={drive._id} data-testid="drive-item">
              <strong>{drive.title}</strong> - {drive.driveType} - {drive.status} - Company: {drive.company?.name || drive.company}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
