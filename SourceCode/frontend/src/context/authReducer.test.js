import { describe, it, expect } from "vitest";

import { authReducer } from "./AuthContext";

describe("AuthContext.jsx::authReducer", () => {
    it("should update user on LOGIN", () => {
        const initialState = { user: null };
        const action = { type: "LOGIN", payload: { email: "test@test.test" } };
        const state = authReducer(initialState, action);

        expect(state.user).toEqual({ email: "test@test.test" });
    });

    it("should clear user on LOGOUT", () => {
        const initialState = { user: { email: "test@test.test" } };
        const action = { type: "LOGOUT" };
        const state = authReducer(initialState, action);

        expect(state.user).toBeNull();
    });

    it("should set authIsReady to true on AUTH_READY dispatch", () => {
        const initialState = { authIsReady: false };
        const action = { type: "AUTH_READY" };
        const state = authReducer(initialState, action);

        expect(state.authIsReady).toBe(true);
    });

    it("should return the current state if an unknown dispatch action is provided", () => {
        const initialState = { user: null, authIsReady: false };
        const action = { type: "UNKNOWN_ACTION" };
        const state = authReducer(initialState, action);

        expect(state).toEqual(initialState);
    });
});
