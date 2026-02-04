import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return { ...state, user: action.payload };
        case "LOGOUT":
            return { ...state, user: null };
        case "AUTH_READY":
            return { ...state, authIsReady: true };
        default:
            return state;
    }
};

export const AuthContextProvider = ({ children }) => {
    const [ state, dispatch ] = useReducer(authReducer, {
        user: null,
        authIsReady: false
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            dispatch({ type: "LOGIN", payload: user });
        }

        dispatch({ type: "AUTH_READY" });
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            { children }
        </AuthContext.Provider>
    );
};
