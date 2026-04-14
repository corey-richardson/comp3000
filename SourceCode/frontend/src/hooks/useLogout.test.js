import { act, renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { useAuthContext } from "./useAuthContext";
import useLogout from "./useLogout";

vi.mock("./useAuthContext", () => ({
    useAuthContext: vi.fn(),
}));

describe("useLogout", () => {
    const mockDispatch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        useAuthContext.mockReturnValue({
            dispatch: mockDispatch
        });

        localStorage.setItem("user", JSON.stringify({ token: "token" }));
    });

    it("should clear localStorage and update AuthContext on logout", () => {
        const { result } = renderHook(() => useLogout());

        act(() => {
            result.current.logout();
        });

        expect(localStorage.getItem("user")).toBeNull();
        expect(mockDispatch).toHaveBeenCalledWith({ type: "LOGOUT" });
    });

    it("should gracefully handle a logout request if localStorage is already empty", () => {
        localStorage.clear();
        const { result } = renderHook(() => useLogout());

        expect(() => {
            act(() => {
                result.current.logout();
            });
        }).not.toThrow();

        expect(mockDispatch).toHaveBeenCalledWith({ type: "LOGOUT" });
    });
});
