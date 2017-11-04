const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI, {
  useMongoClient: true
});

const app = express();

// use of cookie
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // cookie expires in 30days (mil/s)
    keys: [keys.cookieKey] // encrypt cookie
  })
);

app.use(passport.initialize());
app.use(passport.session());

// same as
// const authRoutes = require('./routes/authRoutes')
// authRoutes(app);
require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);

// app: represent express server, creating brand new handler
// .get: watch for incoming HTTP request, get info
// '/': root route
// req: object representing the incoming request
// res: object representing the outgoing response
// res.send: send some JSON back to the request
// .listen: listen to incoming traffic on port
