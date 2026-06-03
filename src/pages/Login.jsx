import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { setAuthToken, setApiUrl, login as backendLogin, register as backendRegister } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState(null);
  const [apiUrl, setApiUrlState] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('FA_API_URL') || window.__FA_API_URL || '';
      setApiUrlState(stored);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // Simple login flow: try backend login; if not present and role is admin/placement_officer, register
      let backendResponse;
      try {
        backendResponse = await backendLogin({ email, password });
      } catch (backendError) {
        // For admin/placement_officer allow auto-register
        if (role === 'placement_officer' || role === 'admin') {
          backendResponse = await backendRegister({ name: email, email, password, role });
        } else {
          throw backendError;
        }
      }

      const backendToken = backendResponse.data?.data?.token || backendResponse.data?.token;
      const user = backendResponse.data?.data?.user || backendResponse.data?.user;
      if (!backendToken || !user) throw new Error('Backend authentication failed');

      setAuthToken(backendToken);
      dispatch({ type: 'SET_AUTH', payload: { user, token: backendToken } });
      localStorage.setItem('authToken', backendToken);
      localStorage.setItem('authUser', JSON.stringify(user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} data-testid="login-form">
        <div>
          <label htmlFor="apiUrl">Backend API URL</label>
          <input
            id="apiUrl"
            value={apiUrl}
            onChange={(e) => setApiUrlState(e.target.value)}
            placeholder="https://your-backend.com/api"
            style={{ width: '100%' }}
          />
          <button type="button" onClick={() => { setApiUrl(apiUrl); setInfo('API URL saved and will be used for requests.'); }} style={{ marginTop: '0.5rem' }}>Save API URL</button>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>If the app is not connecting, enter your backend API URL and save it.</p>
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="placement_officer">Placement Officer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {info && <p style={{ color: 'green' }}>{info}</p>}
      </form>
    </main>
  );
}
