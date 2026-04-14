import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { useApi } from "./useApi";
import { useAuthContext } from "./useAuthContext";

vi.mock("./useAuthContext", () => ({
    useAuthContext: vi.fn(),
}));

describe("useApi", () => {
    const mockDispatch = vi.fn();
    const mockToken = "valid-token";

    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();

        useAuthContext.mockReturnValue({
            user: { token: mockToken },
            dispatch: mockDispatch
        });
    });

    it("should add the Authorization header if a user token exists in AuthContext", async () => {
        global.fetch.mockResolvedValueOnce({
            status: 200,
            ok: true
        });

        const { result } = renderHook(() => useApi());
        await result.current.makeApiCall("/api/test");

        expect(global.fetch).toHaveBeenCalledWith("/api/test", expect.objectContaining({
            headers: expect.objectContaining({
                "Authorization": `Bearer ${mockToken}`,
                "Content-Type": "application/json"
            })
        }));
    });

    it("should log the current user out and clear localStorage on a 401 response", async () => {
        global.fetch.mockResolvedValueOnce({
            status: 401,
            ok: false
        });

        const localStorageSpy = vi.spyOn(Storage.prototype, "removeItem");

        const { result } = renderHook(() => useApi());
        await result.current.makeApiCall("/api/protected-route");

        expect(localStorageSpy).toHaveBeenCalledWith("user");
        expect(mockDispatch).toHaveBeenCalledWith({ type: "LOGOUT" });
    });

    it("should return the response object on success", async () => {
        const mockResponse = {
            status: 200,
            ok: true,
            json: async () => ({ data: "test" })

        };
        global.fetch.mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useApi());
        const response = await result.current.makeApiCall("/api/test");

        expect(response).toBe(mockResponse);
    });

    it("should send an empty Authorization header if user is null", async () => {
        useAuthContext.mockReturnValue({
            user: null,
            dispatch: mockDispatch
        });

        global.fetch.mockResolvedValueOnce({ status: 200 });

        const { result } = renderHook(() => useApi());
        await result.current.makeApiCall("/api/test");

        expect(global.fetch).toHaveBeenCalledWith("/api/test", expect.objectContaining({
            headers: expect.objectContaining({
                "Authorization": ""
            })
        }));
    });
});
