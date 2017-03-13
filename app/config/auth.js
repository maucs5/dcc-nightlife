'use strict';

module.exports = {
  'githubAuth': {
    'clientID': process.env.GITHUB_KEY,
    'clientSecret': process.env.GITHUB_SECRET,
    'callbackURL': process.env.APP_URL + 'auth/github/callback'
  }, 'yelpAuth': {
    'id': process.env.YELP_ID,
    'secret': process.env.YELP_SECRET
  }
};
