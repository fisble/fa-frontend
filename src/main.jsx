import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import App from './App.jsx'
import { setAuthToken } from './services/api';

const token = localStorage.getItem('authToken');
if (token) {
    setAuthToken(token);
}
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AppProvider>
                <App />
            </AppProvider>
        </BrowserRouter>
    </StrictMode>,
)