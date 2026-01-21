import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

const useSignup = () => {
    const [ error, setError ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);

    const { dispatch } = useAuthContext();

    const signup = async ( username, email, password, confirmPassword, firstName, lastName ) => {
        setIsLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setIsLoading(false);
            setError("Passwords don't match!");
            return;
        }

        try {
            const response = await fetch("/api/users/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password, firstName, lastName })
            });

            const json = await response.json();

            if (!response.ok) {
                setIsLoading(false);
                setError(json.error);
                return;
            }

            localStorage.setItem("user", JSON.stringify(json)); // username, email, token
            dispatch({ type: "LOGIN", payload: json });
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { signup, isLoading, error };
};

export default useSignup;
