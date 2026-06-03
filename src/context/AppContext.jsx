import { createContext, useContext, useReducer } from 'react';
import { appReducer, initialState } from '../reducer/appReducer';
const AppContext = createContext();
export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);
    return (
        <AppContext.Provider value={{ state, dispatch }}>
        {children}
        </AppContext.Provider>
    );
};
export const useAppContext = () => useContext(AppContext);
