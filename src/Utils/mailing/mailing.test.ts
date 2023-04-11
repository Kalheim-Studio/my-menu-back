import { sendAccountValidationMail } from "./mailing";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

describe("testing mailing methods", () => {
    dotenv.config();

    it("Should send validation mail", async () => {
        const email = "thierry.agnelli@gmail.com";
        const name = "John Doe";
        const token = "thisisatoken";

        const result = await sendAccountValidationMail(email, name, token);

        expect(result).toBe("email sended");
    });

    it("Should throw error", async () => {
        const email = "thierry.agnelli@gmail.com";
        const name = "John Doe";
        const token = "thisisatoken";

        await expect(
            sendAccountValidationMail(email, name, token, () =>
                nodemailer.createTransport({
                    host: String(process.env.MAIL_HOST),
                    port: parseInt(String(process.env.MAIL_PORT)),
                    secure: true,
                    auth: {
                        user: String(process.env.EMAIL),
                        pass: "wrong_pwd",
                    },
                })
            )
        ).rejects.toMatch("Error on mail sending");
    });
});
