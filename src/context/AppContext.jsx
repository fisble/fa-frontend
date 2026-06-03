import { createContext, useContext, useReducer, useEffect } from 'react';
import { appReducer, initialState } from '../reducer/appReducer';
const AppContext = createContext();
export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken');
            const user = localStorage.getItem('authUser');
            if (token && user) {
                dispatch({ type: 'SET_AUTH', payload: { token, user: JSON.parse(user) } });
            }
        }
    }, []);

    if (typeof window !== 'undefined') {
        window.appState = {
            authUser: state.authUser,
            token: state.token,
            tasks: state.tasks,
            students: state.students,
            companies: state.companies,
            drives: state.drives,
            applications: state.applications,
            interviews: state.interviews,
            filters: state.filters,
            analytics: state.analytics,
            loading: state.loading,
            error: state.error,
        };
    }
    return (
        <AppContext.Provider value={{ state, dispatch }}>
        {children}
        </AppContext.Provider>
    );
};
export const useAppContext = () => useContext(AppContext);
