import { useAppContext } from './context/AppContext'

export default function App() {
  const { state } = useAppContext()

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>FA Frontend</h1>
      <p>Welcome to the frontend application.</p>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </main>
  )
}
