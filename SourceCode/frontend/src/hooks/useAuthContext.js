import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

/**
 * A hook which provides access to the authentication context.
 * * Provides access to the current user state, authentication readiness state
 * * and the dispatch function to update authentication state.
 * * @example
 * const { user, dispatch, authIsReady } = useAuthContext();
 */
export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw Error("AuthContextProvider was null.");
    }

    return context;
};
