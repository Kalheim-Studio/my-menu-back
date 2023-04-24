import { sendAccountValidationMail } from "./mailing";
import nodemailer from "nodemailer";

describe("testing mailing methods", () => {
    it("Should throw error", async () => {
        const mockTransporter = {
            sendMail: jest.fn().mockImplementationOnce(() => {
                throw new Error("This is an error");
            }),
        };

        nodemailer.createTransport = jest.fn().mockResolvedValue(mockTransporter);

        const email = "thierry.agnelli@gmail.com";
        const name = "John Doe";
        const token = "thisisatoken";

        const result = await sendAccountValidationMail(email, name, token);

        // const result = await sendAccountValidationMail(email, name, token);
        expect(result).toBe("Error on mail sending");
    });

    it("Should send validation mail", async () => {
        const mockTransporter = {
            sendMail: jest.fn(),
        };

        nodemailer.createTransport = jest.fn().mockReturnValue(mockTransporter);

        const email = "thierry.agnelli@gmail.com";
        const name = "John Doe";
        const token = "thisisatoken";

        const result = await sendAccountValidationMail(email, name, token);

        expect(result).toBe("Email sent");
    });
});
