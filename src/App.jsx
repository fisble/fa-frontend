import { useAppContext } from './context/AppContext'
import { Link } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './router/ProtectedRoute.jsx';

export default function App() {
  const { state } = useAppContext()

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
        <Link to="/login">Login</Link>
      </nav>
      <h1>FA Frontend</h1>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/" element={<div>Use the menu to navigate</div>} />
      </Routes>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </main>
  )
}
