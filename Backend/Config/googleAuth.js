const passport = require('passport');
require('dotenv').config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // 👉 You can save user to DB here
                // Example:
                // let user = await User.findOrCreate({ googleId: profile.id });

                console.log('profile',profile);

                return done(null, profile); // ✅ correct
            } catch (err) {
                return done(err, null); // ✅ proper error handling
            }
        }
    )
);

// ✅ Serialize only required data (better practice)
passport.serializeUser((user, done) => {
    done(null, user.id); // store only user ID
});

// ✅ Deserialize user using ID
passport.deserializeUser((id, done) => {
    try {
        // 👉 Fetch user from DB here using ID
        // Example:
        // const user = await User.findById(id);

        done(null, id); // ⚠️ replace with actual user object
    } catch (err) {
        done(err, null);
    }
});