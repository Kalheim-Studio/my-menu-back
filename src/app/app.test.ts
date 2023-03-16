import request from "supertest";
import app from "./app";

describe("Testing file app.ts", () => {
    it("Should root routing should be ok(temp).", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ answer: "Ressource not found." });
    });
});
