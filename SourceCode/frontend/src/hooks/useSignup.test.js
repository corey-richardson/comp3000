import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { useAuthContext } from "./useAuthContext";
import useSignup from "./useSignup";

vi.mock("./useAuthContext", () => ({
    useAuthContext: vi.fn(),
}));

describe("useSignup", () => {
    const mockDispatch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
        localStorage.clear();

        useAuthContext.mockReturnValue({
            dispatch: mockDispatch
        });
    });

    it("should fail early if passwords do not match", async () => {
        const { result } = renderHook(() => useSignup());

        await act(async () => {
            await result.current.signup("user1", "test@test.com", "password123", "password456", "Bilbo", "Baggins");
        });

        expect(result.current.error).toBe("Passwords don't match!");
        expect(global.fetch).not.toHaveBeenCalled();
        expect(mockDispatch).not.toHaveBeenCalled();
    });

    it("should signup successfully and update AuthContext and localStorage", async () => {
        const mockUser = { username: "user1", token: "token" };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockUser,
        });

        const { result } = renderHook(() => useSignup());

        await act(async () => {
            await result.current.signup("user1", "test@test.com", "password123", "password123", "Frodo", "Baggins");
        });

        expect(localStorage.getItem("user")).toBe(JSON.stringify(mockUser));
        expect(mockDispatch).toHaveBeenCalledWith({ type: "LOGIN", payload: mockUser });
        expect(result.current.error).toBeNull();
    });

    it("should set error if server returns an error", async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: "Email already in use" }),
        });

        const { result } = renderHook(() => useSignup());

        await act(async () => {
            await result.current.signup("user1", "test@test.com", "password123", "password123", "Sam-Wise", "Gamgee");
        });

        expect(result.current.error).toBe("Email already in use");
        expect(mockDispatch).not.toHaveBeenCalled();
    });
});
