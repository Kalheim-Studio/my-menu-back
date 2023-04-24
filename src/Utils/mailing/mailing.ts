import nodemailer from "nodemailer";
import { logger } from "../logger/logger";

const NAME = "[NO_REPLY]MyMenu";

// Transporter for mail sending (in a function to be called after dotenv.config())
function createTransporter() {
    return nodemailer.createTransport({
        host: String(process.env.MAIL_HOST),
        port: parseInt(String(process.env.MAIL_PORT)),
        secure: true,
        auth: {
            user: String(process.env.EMAIL),
            pass: String(process.env.MAIL_PASS),
        },
    });
}

// Button style
const buttonStyle = `background-color:#B04541;
color:black;padding:0.75em;
border-radius: 2em;
margin-bottom:4em;
text-decoration:none;
margin:0 10em;`;

// Validation mail
const sendAccountValidationMail = async (email: string, name: string, token: string) => {
    // ) => {
    // return new Promise((resolve: (value: string) => void) => {
    // Mail infos
    const mailOptions = {
        from: {
            name: NAME,
            address: String(process.env.EMAIL),
        },
        to: email,
        subject: "Bienvenue",
        html: `
                <div>
                    <p>Bonjour M/Mme ${name}</p>
                    <br/>
                    <p>Vous venez de vous inscrire sur MyMenu, bienvenue à vous.</p>
                    <p>Merci de cliquer sur ce lien pour valider votre compte :</p>
                    <div style="display:flex">
                        <a href="${process.env.FRONT_URL}/account-validation/${token}" style="${buttonStyle}">
                            Validation du compte
                        </a>
                    </div>
                    <br/>
                    <div><i>L'équipe MyMenu.</i></div>
                </div>`,
    };

    // Mail sending
    const transporter = createTransporter();

    // Trying to send mail
    try {
        await transporter.sendMail(mailOptions);
        logger("mailing", "Email sent", { successMessage: "OK" });
        return "Email sent";
    } catch (err) {
        logger("mailing", "Error", { errorMessage: (err as Error).message });
        return "Error on mail sending";
    }
};

export { sendAccountValidationMail };
