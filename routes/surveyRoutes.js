const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredit = require('../middlewares/requireCredit');

const Survey = mongoose.model('surveys'); // import survey schema model

module.exports = app => {
  app.post('/api/surveys', requireLogin, requireCredit, (req, res) => {
    const { title, subject, body, recipients } = req.body;

    //create instance of Survey
    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({ email: email.trim() })), // array of string -> array of objects
      _user: req.user.id, // id generate by mongoose model
      dateSent: Date.now()
    });
  });
};
