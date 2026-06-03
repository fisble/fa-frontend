import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { fetchInterviews } from '../services/api';

export default function Interviews() {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    const loadInterviews = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const res = await fetchInterviews();
        dispatch({ type: 'SET_INTERVIEWS', payload: res.data.data || [] });
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.response?.data?.message || err.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    loadInterviews();
  }, [dispatch]);

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }} data-testid="interviews-page">
      <h1>Interviews</h1>
      {state.loading && <p>Loading interviews...</p>}
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
      {state.interviews.length === 0 && !state.loading ? <p>No interviews found.</p> : (
        <ul>
          {state.interviews.map((interview) => (
            <li key={interview._id} data-testid="interview-item">
              <strong>{interview.student?.name || 'Student'}</strong> / {interview.drive?.title || 'Drive'} / {interview.company?.name || 'Company'} - {new Date(interview.scheduledAt).toLocaleString()} - {interview.status}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
