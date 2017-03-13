'use strict';

var path = process.cwd();

let yelp = require('../config/auth').yelpAuth
let request = require('request')
let controller = require('../controllers/locationController')

module.exports = function (app, passport) {

  app.use((req, res, next) => {
    res.locals.auth = req.isAuthenticated()
    next()
  })

  app.get('/', (req, res) => {
    res.render('index')
  })

  app.get('/search', (req, res) => {
    let q = req.query.q

    // the correct method is to make sure token is used only once, but i am
    // lazy for this implementation
    let f_res = (e, r, body) => {
      controller.display(JSON.parse(body), data => {
	res.render('index', {result: data})
      })
    }
    let f_token = (e, r, body) => {
      let t = JSON.parse(body)['access_token']
      request.get(
	'https://api.yelp.com/v3/businesses/search?term=bar&limit=10&location='+q,
	{headers: {'Authorization': 'Bearer ' + t}},
	f_res
      )}
    request.post(
      'https://api.yelp.com/oauth2/token',
      {form: {
	'grant_type': 'client_credentials',
	client_id: yelp.id,
	client_secret: yelp.secret
      }},
      f_token
    )
  })

  app.get('/click/:id',
	  (req, res, next) => {
	    if (req.isAuthenticated()) next()
	    else res.json({error: 'Error, not logged in. Please reload the page'})
	  }, (req, res) => {
	    controller.click(req.user.github.id ,req.params.id, data => {
	      res.json(data)
	    })
	  })

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  let set_redirect = (req, res, next) => {
    req.session.redirectTo = req.headers.referer
    next()
  }
  app.get('/auth/github/', set_redirect, passport.authenticate('github'))

  app.get('/auth/github/callback',
	  passport.authenticate('github', {
	    successRedirect: '/after',
	    failureRedirect: '/after'
	  }))

  app.get('/after', (req, res) => {
    let r = req.session.redirectTo
    delete req.session.redirectTo
    res.redirect(r)
  })
};
