const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

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
