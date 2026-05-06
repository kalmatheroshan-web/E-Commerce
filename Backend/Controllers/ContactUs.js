
async function contactUsController(req, res) {
    try {
        const { email, firstname, lastname, message, phoneNo, countrycode } = req.body;
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

module.exports = contactUsController;