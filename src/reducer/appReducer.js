export const initialState = {
    tasks: [],
    loading: false,
    error: null,
};
export const appReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TASKS':
        return { ...state, tasks: action.payload };
        case 'SET_LOADING':
        return { ...state, loading: action.payload };
        case 'SET_ERROR':
        return { ...state, error: action.payload };
        default:
        return state;
    }
};