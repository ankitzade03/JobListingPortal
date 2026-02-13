// import passport from "passport";
// import GoogleStrategy from "passport-google-oauth20";
// // import LinkedInStrategy from "passport-linkedin-oauth2";
// import User from "../models/User.js";

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/api/auth/google/callback",
//     },
//     async (_, __, profile, done) => {
//       let user = await User.findOne({ email: profile.emails[0].value });

//       if (!user) {
//         user = await User.create({
//           name: profile.displayName,
//           email: profile.emails[0].value,
//           role: "jobseeker",
//           provider: "google",
//         });
//       }
//       done(null, user);
//     }
//   )
// );

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../module/User.js";
// import User from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            role: "jobseeker", // default role
            provider: "google",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

