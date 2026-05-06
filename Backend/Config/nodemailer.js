const nodemailer = require("nodemailer");

async function sendMail() {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "your-email@gmail.com",
            pass: "your-app-password" // NOT your real password
        }
    });

    let info = await transporter.sendMail({
        from: '"Your Name" <your-email@gmail.com>',
        to: "receiver@example.com",
        subject: "Hello from Node.js",
        text: "This is a test email",
        html: "<b>This is a test email</b>"
    });

    console.log("Message sent:", info.messageId);
}

sendMail().catch(console.error);

module.exports = sendMail;