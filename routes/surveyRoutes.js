const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredit = require('../middlewares/requireCredit');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys'); // import survey schema model

module.exports = app => {
  app.get('/api/surveys/thanks', (req, res) => {
    res.send('Thanks for voting');
  });
  app.post('/api/surveys', requireLogin, requireCredit, async (req, res) => {
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

    // Mailer
    // arg: (survey instance(subject/recipients), content of email)
    const mailer = new Mailer(survey, surveyTemplate(survey));
    // try catch error
    try {
      await mailer.send();
      await survey.save();
      // credit - 1 = credit
      req.user.credits -= 1;
      const user = await req.user.save();
      // send updated user model
      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};
