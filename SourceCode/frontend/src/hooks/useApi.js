import { useCallback, useMemo } from "react";

import { useAuthContext } from "./useAuthContext";

/**
 * This hook acts as a `fetch` wrapper for API requests that handles:
 * 1. Attaching the Bearer token from the AuthContext to the Authorization header
 * 2. Enforcing the Content-Type as application/json
 * 3. 401 Unauthorized responses by logging the user out and clearing localStorage
 * @returns {Object} containing the `makeApiCall` function
 */
export const useApi = () => {
    const { dispatch, user } = useAuthContext();

    /**
     * Performs an API request using Authorization headers gained from AuthContext
     * * @async
     * @param {string} url
     * @param {Object} [options = {}] : method, body, header, etc
     * @returns {Promise<Response | Undefined>} Returns the API fetch response
     */
    const makeApiCall = useCallback(async (url, options = {}) => {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                "Authorization": user?.token ? `Bearer ${user.token}` : "",
                "Content-Type": "application/json"
            }
        });

        if (response.status === 401) {
            localStorage.removeItem("user");
            dispatch({ type: "LOGOUT" });
            return;
        }

        return response;
    }, [user?.token, dispatch]);

    return useMemo(() => ({ makeApiCall }), [makeApiCall]);
};
