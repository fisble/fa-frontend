import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { fetchStudents } from '../services/api';

export default function Students() {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    const loadStudents = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const res = await fetchStudents();
        dispatch({ type: 'SET_STUDENTS', payload: res.data.data || [] });
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.response?.data?.message || err.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    loadStudents();
  }, [dispatch]);

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }} data-testid="students-page">
      <h1>Students</h1>
      {state.loading && <p>Loading students...</p>}
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
      {state.students.length === 0 && !state.loading ? <p>No students found.</p> : (
        <ul>
          {state.students.map((student) => (
            <li key={student._id} data-testid="student-item">
              <strong>{student.name}</strong> ({student.email}) - {student.department} - CGPA: {student.cgpa}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
