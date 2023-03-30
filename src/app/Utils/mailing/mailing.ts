import nodemailer from "nodemailer";

// Création du transporter pour envoie des mails
const transporter = nodemailer.createTransport({
    host: String(process.env.MAIL_HOST),
    port: parseInt(String(process.env.MAIL_PORT)),
    secure: false,
    auth: {
        user: String(process.env.EMAIL), // generated ethereal user
        pass: String(process.env.MAIL_PASS), // generated ethereal password
    },
});

// Informations de l'expéditeur
const senderInfos = {
    name: String(process.env.SENDER_NAME),
    address: String(process.env.EMAIL),
};

// Adresse Front
const buttonStyle = `background-color:#B04541;
color:black;padding:0.75em;
border-radius: 2em;
margin-bottom:4em;
text-decoration:none;
margin:0 10em;`;

// Mail de validation du compte crée
export const sendAccountValidationMail = (email: string, name: string, token: string) => {
    return new Promise((resolve, reject) => {
    // Mail infos
        const mailOptions = {
            from: senderInfos, // Infos expéditeur
            to: email, // Liste de reception
            subject: "Bienvenue", // Objet
            html: `
                <div>
                    <p>Bonjour M/Mme ${name}</p>
                    <br/>
                    <p>Vous venez de vous inscrire sur mon site, bienvenue à vous.</p>
                    <p>Merci de cliquer sur ce lien pour valider votre compte :</p>
                    <div style="display:flex">
                        <a href="${process.env.FRONT_URL}/account-validation/${token}" style="${buttonStyle}">
                            Validation du compte
                        </a>
                    </div>
                    <br/>
                    <div><i>Thierry Agnelli</i></div>
                    <div><i>Développeur Fullstack Javascript/React/React Native/Node...etc </i></div>
                </div>`,
        };
        // Envoi du mail
        transporter.sendMail(mailOptions, (err) => {
            if (err) reject(err);
            else {
                resolve("email sended");
            }
        });
    });
};
