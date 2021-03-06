const mongoose = require('mongoose');
const { Schema } = mongoose;
const RecipientSchema = require('./Recipient');

// survey schema
const surveySchema = new Schema({
  title: String,
  body: String,
  subject: String,
  recipients: [RecipientSchema], //mongoose sub document collection
  yes: { type: Number, default: 0 },
  no: { type: Number, default: 0 },
  _user: { type: Schema.Types.ObjectId, ref: 'User' }, // reference of user who owns the survey
  dateSent: Date,
  lastResponded: Date
});

mongoose.model('surveys', surveySchema);
