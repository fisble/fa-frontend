export const initialState = {
    tasks: [],
    authUser: null,
    token: null,
    students: [],
    companies: [],
    drives: [],
    applications: [],
    analytics: {},
    filters: {},
    loading: false,
    error: null,
};
export const appReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TASKS':
        return { ...state, tasks: action.payload };
        case 'SET_AUTH':
        return { ...state, authUser: action.payload.user, token: action.payload.token };
        case 'SET_STUDENTS':
        return { ...state, students: action.payload };
        case 'SET_COMPANIES':
        return { ...state, companies: action.payload };
        case 'SET_DRIVES':
        return { ...state, drives: action.payload };
        case 'SET_APPLICATIONS':
        return { ...state, applications: action.payload };
        case 'SET_ANALYTICS':
        return { ...state, analytics: action.payload };
        case 'SET_FILTERS':
        return { ...state, filters: action.payload };
        case 'SET_LOADING':
        return { ...state, loading: action.payload };
        case 'SET_ERROR':
        return { ...state, error: action.payload };
        default:
        return state;
    }
};