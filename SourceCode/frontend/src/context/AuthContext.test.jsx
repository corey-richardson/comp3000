import { render, waitFor } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { AuthContextProvider, AuthContext } from "./AuthContext";

describe("AuthContextProvider::authHandshake", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
        localStorage.clear();
    });

    it("logs in if a valid token exists in localStorage", async () => {
        // Arrange
        const mockUser = { email: "test@test.com", token: "valid" };
        localStorage.setItem("user", JSON.stringify(mockUser));

        global.fetch.mockResolvedValueOnce({ ok: true });

        let contextValue;
        const TestHarness = () => {
            contextValue = React.useContext(AuthContext);
            return null;
        };

        // Act
        render(
            <AuthContextProvider>
                <TestHarness />
            </AuthContextProvider>
        );

        await waitFor(() => expect(contextValue.authIsReady).toBe(true));

        // Assert
        expect(contextValue.user).toEqual(mockUser);
        expect(global.fetch).toHaveBeenCalledWith("/api/auth/handshake", expect.anything());
    });

    it("clears localStorage if the authHandshake fails", async () => {
        // Arrange
        const mockUser = { email: "test@test.com", token: "invalid" };
        localStorage.setItem("user", JSON.stringify(mockUser));

        // Mock a 401 response
        global.fetch.mockResolvedValueOnce({ ok: false });

        let contextValue;
        const TestHarness = () => {
            contextValue = React.useContext(AuthContext);
            return null;
        };

        // Act
        render(
            <AuthContextProvider>
                <TestHarness />
            </AuthContextProvider>
        );

        await waitFor(() => expect(contextValue.authIsReady).toBe(true));

        // Assert
        expect(contextValue.user).toBeNull();
        expect(localStorage.getItem("user")).toBeNull();
    });

    it("should initialise AUTH_READY even when there is no user in localStorage", async () => {
        // Arrange
        let contextValue;
        const TestHarness = () => {
            contextValue = React.useContext(AuthContext);
            return null;
        };

        // Act
        render(
            <AuthContextProvider>
                <TestHarness />
            </AuthContextProvider>
        );

        await waitFor(() => expect(contextValue.authIsReady).toBe(true));

        // Assert
        expect(contextValue.user).toBeNull();
        expect(global.fetch).not.toHaveBeenCalled();
    });
});
