import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { useAuthContext } from "./useAuthContext";
import { AuthContext } from "../context/AuthContext";

describe("useAuthContext", () => {
    it("should return a context when used within AuthContextProvider", () => {
        // Arrange
        const mockContext = {
            user: {
                token: "27",
                email: "king.gizzard@lizard.wizard"
            },
            dispatch: () => {}
        };

        const contextProvider = ({ children }) => (
            <AuthContext.Provider value={ mockContext }>
                { children }
            </AuthContext.Provider>
        );

        // Act
        const { result } = renderHook(() => useAuthContext(), {
            wrapper: contextProvider
        });

        // Assert
        expect(result.current).toEqual(mockContext);
        expect(result.current.user.token).toBe("27");
    });

    it("should throw an error when used outside of an AuthContextProvider", () => {
        expect(() => renderHook(() => useAuthContext())).toThrow("AuthContextProvider was null.");
    });
});
