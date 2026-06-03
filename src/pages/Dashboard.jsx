import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { fetchStats } from '../services/api';

export default function Dashboard() {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    const loadStats = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const res = await fetchStats();
        dispatch({ type: 'SET_ANALYTICS', payload: res.data.data });
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    loadStats();
  }, [dispatch]);

  const analytics = state.analytics || {};

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Dashboard</h1>
      {state.loading && <p>Loading...</p>}
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
      <pre>{JSON.stringify(analytics, null, 2)}</pre>
    </main>
  );
}
