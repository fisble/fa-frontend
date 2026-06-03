import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { fetchCompanies } from '../services/api';

export default function Companies() {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    const loadCompanies = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const res = await fetchCompanies();
        dispatch({ type: 'SET_COMPANIES', payload: res.data.data || [] });
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.response?.data?.message || err.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    loadCompanies();
  }, [dispatch]);

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }} data-testid="companies-page">
      <h1>Companies</h1>
      {state.loading && <p>Loading companies...</p>}
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
      {state.companies.length === 0 && !state.loading ? <p>No companies found.</p> : (
        <ul>
          {state.companies.map((company) => (
            <li key={company._id} data-testid="company-item">
              <strong>{company.name}</strong> - {company.industry} - {company.website || 'No website'}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
