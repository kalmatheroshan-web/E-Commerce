const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // IMPORTANT: false for 587

    requireTLS: true,

    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
    },

    tls: {
        family: 4,
        rejectUnauthorized: false,
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

        console.error("FULL EMAIL ERROR:");
        console.error(error);

        throw error;
    }
}

module.exports = sendMail;
