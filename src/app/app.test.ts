import request from "supertest";
import app from "./app";

describe("Testing file app.ts", () => {
    it("Should root routing should be ok(temp).", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ answer: "response!" });
    });
});
