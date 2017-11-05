const passport = require('passport');

module.exports = app => {
  // first route handler to authentication page
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  // second route handler user visits
  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      // after authenticate, redirect to survey page
      res.redirect('/surveys');
    }
  );

  // logout route handler
  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  // third route handler
  app.get('/api/current_user', (req, res) => {
    res.send(req.user); //get access to user
  });
};
