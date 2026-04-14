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
        const authHandshake = async () => {
            const storedUser = JSON.parse(localStorage.getItem("user"));

            if (!storedUser || !storedUser.token) {
                dispatch({ type: "AUTH_READY" });
                return;
            }

            try {
                const response = await fetch("/api/auth/handshake", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${storedUser.token}`

                    }
                });

                if (response.ok) {
                    dispatch({ type: "LOGIN", payload: storedUser });
                } else {
                    localStorage.removeItem("user");
                    dispatch({ type: "LOGOUT" });
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.log("Auth Handshake Failed: ", error);
            } finally {
                dispatch({ type: "AUTH_READY" });
            }
        };

        authHandshake();
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            { children }
        </AuthContext.Provider>
    );
};
