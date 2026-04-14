import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("Frontend Test Environment Runs", () => {
    it("should verify vitest is running", () => {
        expect(true).toBe(true);
    });

    it ("should verify JSDOM and React Testing Library are running", () => {
        render(<div>Hello World!</div>);
        expect(screen.getByText("Hello World!")).toBeTruthy();
    });
});
