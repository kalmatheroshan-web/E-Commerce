const nodemailer = require("nodemailer");
require('dotenv').config();

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
 
    family: 4, 
    auth: {
        user: "fikrishopy@gmail.com",
        pass: process.env.GMAIL_PASSWORD 
    },
    connectionTimeout: 10000, 
    greetingTimeout: 10000,
    socketTimeout: 10000
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
