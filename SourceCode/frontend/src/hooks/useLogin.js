import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

const useLogin = () => {
    const [ error, setError ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);

    const { dispatch } = useAuthContext();

    const login = async ( email, password ) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const json = await response.json();

            if (!response.ok) {
                setIsLoading(false);
                setError(json.error);
                return;
            }

            localStorage.setItem("user", JSON.stringify(json)); // username, email, token
            dispatch({ type: "LOGIN", payload: json })
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { login, isLoading, error };
}

export default useLogin;
