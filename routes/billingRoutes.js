const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  // post token on server
  // requireLogin: Middleware function that check if user logged in
  app.post('/api/stripe', requireLogin, async (req, res) => {
    const charge = await stripe.charges.create({
      amount: 500,
      currency: 'usd',
      description: '$5 for 5 credits',
      source: req.body.id
    });
    // add credit
    req.user.credits += 5;
    const user = await req.user.save();
    // send back a user model to user who made request
    res.send(user);
  });
};
