import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw Error("Context was null, AuthContext must be used within AuthContextProvider.");
    }

    return context;
};
