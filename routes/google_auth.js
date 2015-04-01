var Router = require('router'),
  models = require('../models/models'),
 	google = require('googleapis'),
	cookieParser = require('cookie-parser'),
	OAuth2 = google.auth.OAuth2,
  helpers = require('../helpers/check_authentication'),
  config = require('../config.json'),
  passport = require('passport'),
  hat = require('hat');

module.exports = (function() {
	var router = Router();

	var scopes = [
	  'https://www.googleapis.com/auth/plus.me',
	  'https://www.googleapis.com/auth/calendar',
	  'https://www.google.com/m8/feeds',
	  'https://www.googleapis.com/auth/userinfo.email',
	  'https://www.googleapis.com/auth/userinfo.profile'

	];

	var oauth2Client = new OAuth2(config.client_id, config.client_secret, "http://127.0.0.1:3000/auth/google/callback")

	router.get('/', function (req, res) {
		url = oauth2Client.generateAuthUrl({
		  access_type: 'offline', 
		  scope: scopes 
		});
		res.redirect(url);
	});

	router.get( '/callback', function (req, res) {
		oauth2Client.getToken(req.query.code, function(err, tokens) {
		  if(!err) {
		  	firstChunk = tokens.id_token.split(".")[0]
		    oauth2Client.setCredentials(tokens);
		    return models.UserModel.findOrCreate({googleId: firstChunk}, {googleAccessToken: tokens.access_token, googleIdToken: tokens.id_token}, function(err, user, created){
		    	if (err) {
		    		return res.redirect('/login');
		    	}
		    	if (created == true) {
		    		var accessToken = hat();
		    		return models.UserModel.update({googleId: firstChunk}, {$set: {uniqueAccessToken: accessToken}}, function(err, user){
				    	res.cookie('access_token', user.uniqueAccessToken, { maxAge: 900000, httpOnly: true });
				    	return res.redirect('/auth/google/success');
		    		});
		    	} else {
			    	res.cookie('access_token', user.uniqueAccessToken, { maxAge: 900000, httpOnly: true });
			    	return res.redirect('/auth/google/success');
			    }
		    });
		  } else {
		  	return res.redirect('/login')
		  }
		});
	});

	router.get('/success', function (req, res) {
		return helpers.ensureAuthenticated(req, res).then(function(authenticated){
			if(!authenticated){
				return res.redirect('/login');
			} else {
				return res.send('Success!!');
			}
		});
	});

	return router;
	
})();