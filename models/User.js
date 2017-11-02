const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String
});

// creating collection of users.
mongoose.model('users', userSchema);
