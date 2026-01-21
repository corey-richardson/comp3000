import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw Error("Context was null, AuthContext must be used within AuthContextProvider.");
    }

    return context;
}
