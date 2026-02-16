import { useCallback, useMemo } from "react";

import { useAuthContext } from "./useAuthContext";

export const useApi = () => {
    const { dispatch, user } = useAuthContext();

    const makeApiCall = useCallback(async (url, options = {}) => {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                "Authorization": user?.token ? `Bearer ${user.token}` : "",
                "Content-Type": "application/json"
            }
        });

        console.log("API status:", response.status);

        if (response.status === 401) {
            localStorage.removeItem("user");
            dispatch({ type: "LOGOUT" });
            return;
        }

        return response;
    }, [user?.token, dispatch]);

    return useMemo(() => ({ makeApiCall }), [makeApiCall]);
};
