const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_KEY);

async function sendMail(email, subject, text, html) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Fikri Shop <onboarding@resend.dev>', // See note below
            to: email,
            subject: subject,
            text: text,
            html: html,
        });

        if (error) {
            console.error("Resend Error:", error);
            return;
        }

        console.log("Email sent! ID:", data.id);
    } catch (err) {
        console.error("System Error:", err);
    }
}

module.exports = sendMail;