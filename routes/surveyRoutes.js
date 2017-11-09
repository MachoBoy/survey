const _ = require('lodash');
const Path = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredit = require('../middlewares/requireCredit');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys'); // import survey schema model

module.exports = app => {
  app.get('/api/surveys', requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }) // return query object
      .select({ recipients: false }); // do not bring recipients collection
    res.send(surveys);
  });

  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for voting');
  });

  app.post('/api/surveys/webhooks', (req, res) => {
    const p = new Path('/api/surveys/:surveyId/:choice'); // extract surveyId and choice
    // lodash chain helper
    _.chain(req.body)
      .map(({ email, url }) => {
        const match = p.test(new URL(url).pathname); // extract path from the url
        if (match) {
          return { email, surveyId: match.surveyId, choice: match.choice };
        }
      })
      // remove the elements are undefined
      .compact()
      // remove duplicate email and surveyId
      .uniqBy('email', 'surveyId')
      .each(({ surveyId, email, choice }) => {
        // async // updateOne: find and update
        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email: email, responded: false }
            }
          },
          {
            // Mongo
            $inc: { [choice]: 1 },
            $set: { 'recipients.$.responded': true },
            lastResponded: new Date()
          }
        ).exec(); // execute
      })
      .value();

    res.send({});
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
