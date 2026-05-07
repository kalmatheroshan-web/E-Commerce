const nodemailer = require("nodemailer");
require('dotenv').config();

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "fikrishopy@gmail.com",
        pass: process.env.GMAIL_PASSWORD // NOT your real password
    }
});

async function sendMail(email, subject, text, html) {
    try {
        let info = await transporter.sendMail({
            from: '"Fikri Shop" <fikrishopy@gmail.com>',
            to: email,
            subject: subject,
            text: text,
            html: html
        });
        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email: ", error);
        throw error;
    }
}

module.exports = sendMail;
