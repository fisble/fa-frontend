import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { fetchApplications } from '../services/api';

export default function Applications() {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    const loadApplications = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const res = await fetchApplications();
        dispatch({ type: 'SET_APPLICATIONS', payload: res.data.data || [] });
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.response?.data?.message || err.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    loadApplications();
  }, [dispatch]);

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }} data-testid="applications-page">
      <h1>Applications</h1>
      {state.loading && <p>Loading applications...</p>}
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
      {state.applications.length === 0 && !state.loading ? <p>No applications found.</p> : (
        <ul>
          {state.applications.map((application) => (
            <li key={application._id} data-testid="application-item">
              <strong>{application.student?.name || 'Unknown student'}</strong> applied for <strong>{application.drive?.title || 'Unknown drive'}</strong> - {application.status}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
