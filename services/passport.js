const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

// Model Class
const User = mongoose.model('users');

// set up cookie
passport.serializeUser((user, done) => {
  done(null, user.id); // user.id automatically generate by mongoDB
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        // we already have a record with given profile ID
        return done(null, existingUser);
      }
      // make a new record
      const user = await new User({ googleId: profile.id }).save(); // take model instance and save it to DB
      done(null, user);
    }
  )
);
