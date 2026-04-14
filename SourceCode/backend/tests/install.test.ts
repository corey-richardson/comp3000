import express from "express";
import request from "supertest";
import { describe, it, expect } from "vitest";

const app = express();
app.get("/test", (request, response) => response.status(200).json({ ok: true }));

describe("Backend Test Environment Runs", () => {
    it("should verify vitest is running", () => {
        expect(true).toBe(true);
    });

    it("should verify Supertest can reach a route", async () => {
        const response = await request(app).get("/test");
        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);
    });
});
