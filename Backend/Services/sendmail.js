const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
    },
});


async function sendMail(email, subject, text = "", html = "") {
    try {
 
        // Verify SMTP connection
        await transporter.verify();
        console.log("SMTP server is ready");

        const info = await transporter.sendMail({
            from: `"Fikri Shop" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: subject,
            text: text,
            html: html,
        });

        console.log("Message sent:", info.messageId);

        return info;

    } catch (error) {

        console.error("Email sending failed:");
        console.error(error);

        throw new Error(error.message || "Failed to send email");
    }
}

module.exports = sendMail;
