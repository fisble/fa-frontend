import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { setAuthToken, login as backendLogin, register as backendRegister } from '../services/api';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const TOKEN_URL = import.meta.env.VITE_TOKEN_URL;
      const STUDENT_ID = import.meta.env.VITE_STUDENT_ID || email;
      const STUDENT_PASSWORD = import.meta.env.VITE_STUDENT_PASSWORD || password;
      if (!TOKEN_URL) throw new Error('TOKEN_URL not configured');
      const res = await axios.post(TOKEN_URL, { studentId: STUDENT_ID, password: STUDENT_PASSWORD }, { headers: { 'Content-Type': 'application/json' } });
      const examToken = res.data?.token || res.data?.data?.token || res.data?.access_token;
      if (!examToken) throw new Error('Token not returned from provider');
      localStorage.setItem('examToken', examToken);

      let backendResponse;
      try {
        backendResponse = await backendLogin({ email, password });
      } catch (backendError) {
        backendResponse = await backendRegister({ name: email, email, password, role: 'placement_officer' });
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
          <label htmlFor="email">Email</label>
          <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </div>
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </main>
  );
}
