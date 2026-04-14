import { useAuthContext } from "./useAuthContext";

/**
 * This hook handles the user logout process.
 * * Clears the session by removing the "user" item from localStorage
 * * Updates the AuthContext with the LOGOUT dispatch
 * * @example
 * const { logout } = useLogout();
 */
const useLogout = () => {
    const { dispatch } = useAuthContext();

    const logout = () => {
        localStorage.removeItem("user");
        dispatch({ type: "LOGOUT" });
    };

    return { logout };
};

export default useLogout;
