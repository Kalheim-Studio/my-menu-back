import nodemailer, { createTransport } from "nodemailer";

// Transporter for mail sending
function createTransporterFunction() {
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
const sendAccountValidationMail = (
    email: string,
    name: string,
    token: string,
    createTransporter = createTransporterFunction
) => {
    return new Promise((resolve, reject) => {
    // Mail infos
        const mailOptions = {
            from: {
                name: String(process.env.SENDER_NAME),
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
        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.log(err);
                reject("Error on mail sending");
            } else {
                resolve("email sended");
            }
        });
    });
};

export { sendAccountValidationMail };
