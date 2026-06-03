import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { fetchStats } from '../services/api';
import { syncDataset } from '../services/api';

export default function Dashboard() {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    const loadStats = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const res = await fetchStats();
        dispatch({ type: 'SET_ANALYTICS', payload: res.data.data });
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.response?.data?.message || err.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    loadStats();
  }, [dispatch]);

  const analytics = state.analytics || {};
  const totals = analytics.totals || {};

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }} data-testid="dashboard-page">
      <h1>Dashboard</h1>
      {state.loading && <p>Loading...</p>}
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
      {state.authUser?.role === 'admin' ? (
        <section>
          <h2>Admin</h2>
          <p>Only dataset sync is available for Admin.</p>
          <button onClick={async () => {
            dispatch({ type: 'SET_LOADING', payload: true });
            try {
              const res = await syncDataset();
              dispatch({ type: 'SET_ERROR', payload: null });
              alert('Sync completed: ' + (res.data?.message || 'OK'));
            } catch (err) {
              dispatch({ type: 'SET_ERROR', payload: err.response?.data?.message || err.message });
            } finally {
              dispatch({ type: 'SET_LOADING', payload: false });
            }
          }}>Sync Dataset</button>
        </section>
      ) : (
        <div>
          <p><strong>Students:</strong> {totals.students ?? 'N/A'}</p>
          <p><strong>Companies:</strong> {totals.companies ?? 'N/A'}</p>
          <p><strong>Drives:</strong> {totals.drives ?? 'N/A'}</p>
          <p><strong>Applications:</strong> {totals.applications ?? 'N/A'}</p>
          <p><strong>Selected:</strong> {totals.selected ?? 'N/A'}</p>
          <p><strong>Rejected:</strong> {totals.rejected ?? 'N/A'}</p>
          <p><strong>Pending:</strong> {totals.pending ?? 'N/A'}</p>
        </div>
      )}
      {analytics.companyStats && (
        <section>
          <h2>Company drive counts</h2>
          <ul>
            {analytics.companyStats.map((company) => (
              <li key={company._id || company.name}>{company.name}: {company.drivesCount}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
