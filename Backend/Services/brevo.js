const axios = require('axios');
require('dotenv').config();

async function sendEmail(email, subject, text = "", html = "") {
    const data = {
        sender: { name: 'Fikri Shop', email: "kalmatheroshan@gmail.com" },
        to: [{ email: email }],
        subject: subject,
        htmlContent: html || text
    };

    try {
        const response = await axios.post('https://api.brevo.com/v3/smtp/email', data, {
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json'
            }
        });
        console.log("Email sent!", response.data);
        return response.data;
    } catch (err) {
        console.error("API Error:", err.response ? err.response.data : err.message);
        throw err;
    }
}

module.exports = sendEmail;