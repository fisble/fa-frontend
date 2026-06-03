import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { setAuthToken } from '../services/api';
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
      // Request token from exam provider
      const TOKEN_URL = import.meta.env.VITE_TOKEN_URL;
      const STUDENT_ID = import.meta.env.VITE_STUDENT_ID || email;
      const STUDENT_PASSWORD = import.meta.env.VITE_STUDENT_PASSWORD || password;
      if (!TOKEN_URL) throw new Error('TOKEN_URL not configured');
      const res = await axios.post(TOKEN_URL, { studentId: STUDENT_ID, password: STUDENT_PASSWORD }, { headers: { 'Content-Type': 'application/json' } });
      const token = res.data?.token || res.data?.data?.token || res.data?.access_token;
      if (!token) throw new Error('Token not returned from provider');
      // store auth locally
      dispatch({ type: 'SET_AUTH', payload: { user: { email }, token } });
      setAuthToken(token);
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify({ email }));
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
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </div>
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </main>
  );
}
