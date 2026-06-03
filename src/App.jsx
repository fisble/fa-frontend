import { useAppContext } from './context/AppContext'
import { Link, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Students from './pages/Students.jsx';
import Companies from './pages/Companies.jsx';
import Drives from './pages/Drives.jsx';
import Applications from './pages/Applications.jsx';
import Interviews from './pages/Interviews.jsx';
import ProtectedRoute from './router/ProtectedRoute.jsx';
import { setAuthToken } from './services/api';
import AdminSync from './pages/AdminSync.jsx';

export default function App() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'SET_AUTH', payload: { user: null, token: null } });
    setAuthToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('examToken');
    navigate('/login');
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
          <Link to="/students" style={{ marginRight: '1rem' }}>Students</Link>
          <Link to="/companies" style={{ marginRight: '1rem' }}>Companies</Link>
          <Link to="/drives" style={{ marginRight: '1rem' }}>Drives</Link>
          <Link to="/applications" style={{ marginRight: '1rem' }}>Applications</Link>
          <Link to="/interviews" style={{ marginRight: '1rem' }}>Interviews</Link>
          <Link to="/admin-sync" style={{ marginRight: '1rem' }}>Admin Sync</Link>
        </div>
        <div>
          {state.authUser ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <h1>FA Frontend</h1>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
        <Route path="/companies" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
        <Route path="/drives" element={<ProtectedRoute><Drives /></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
        <Route path="/interviews" element={<ProtectedRoute><Interviews /></ProtectedRoute>} />
        <Route path="/admin-sync" element={<ProtectedRoute><AdminSync /></ProtectedRoute>} />
        <Route path="/" element={state.authUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      </Routes>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </main>
  )
}
