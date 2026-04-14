import { act, renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { useAuthContext } from "./useAuthContext";
import useLogin from "./useLogin";

vi.mock("./useAuthContext", () => ({
    useAuthContext: vi.fn(),
}));

describe("useLogin", () => {
    const mockDispatch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
        localStorage.clear();

        useAuthContext.mockReturnValue({
            dispatch: mockDispatch
        });
    });

    it("should login successfully and update localStorage and AuthContext", async () => {
        const mockUser = { email: "test@test.com", token: "valid" };
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockUser,
        });

        const { result } = renderHook(() => useLogin());

        await act(async () => {
            await result.current.login("test@test.com", "password123");
        });

        expect(localStorage.getItem("user")).toBe(JSON.stringify(mockUser));
        expect(mockDispatch).toHaveBeenCalledWith({ type: "LOGIN", payload: mockUser });
    });

    it("should handle unsuccessful login attempts", async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: "Invalid credentials." }),
        });

        const { result } = renderHook(() => useLogin());

        await act(async () => {
            await result.current.login("test@test.com", "wrong-password");
        });

        expect(localStorage.getItem("user")).toBeNull();
        expect(mockDispatch).not.toHaveBeenCalled();
        expect(result.current.error).toBe("Invalid credentials.");
    });

    it("should handle a network error", async () => {
        global.fetch.mockRejectedValueOnce(
            new Error("Network error.")
        );

        const { result } = renderHook(() => useLogin());

        await act(async () => {
            await result.current.login("test@test.com", "password123");
        });

        expect(result.current.error).toBe("Network error.");
        expect(result.current.isLoading).toBe(false);
    });
});
