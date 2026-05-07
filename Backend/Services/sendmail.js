const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    family: 4, // FORCE IPv4

    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

async function sendMail(email, subject, text = "", html = "") {
    try {

        await transporter.verify();
        console.log("SMTP server is ready");

        const info = await transporter.sendMail({
            from: `"Fikri Shop" <${process.env.GMAIL_USER}>`,
            to: email,
            subject,
            text,
            html,
        });

        console.log("Message sent:", info.messageId);

        return info;

    } catch (error) {

        console.error("Email Error:", error);

        throw error;
    }
}

module.exports = sendMail;
