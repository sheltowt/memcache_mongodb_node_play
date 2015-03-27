var Router = require('router'),
  models = require('../models/models'),
 	google = require('googleapis'),
	cookieParser = require('cookie-parser'),
	OAuth2 = google.auth.OAuth2,
  config = require('../config.json'),
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
			if(err){
				console.log(err)
			}
		  firstChunk = tokens.id_token.split(".")[0]
		  if(!err) {
		    oauth2Client.setCredentials(tokens);
		    return models.UserModel.findOrCreate({googleId: firstChunk}, {googleAccessToken: tokens.access_token, googleIdToken: tokens.id_token}, function(err, user, created){
		    	var cookieId
		    	if (created == true){
		    		uniqueId = hat();
		    		coookieId = niqueId
		    		models.UserModel.findByIdAndUpdate({googleId: firstChunk}, {$set: {uniqueAccessToken: uniqueId}}, function(err, user) {
		    			console.log(err, user)
		    		})
		    	} else {
		    		cookieId = user.uniqueAccessToken
		    	}
		    	res.cookie('access_token', cookieId, { maxAge: 900000, httpOnly: true });
		    	return res.redirect('/auth/google/success');
		    })
		  }
		});
	});

	router.get('/success', function (req, res) {
		console.log('default page');
	  res.send('you are successfully logged in');
	});

	router.get('/practice', function (req, res) {
		return helpers.ensureAuthenticated(req, res).then(function(authenticated){
			if(!authenticated){
				return res.redirect('/login');
			} else {
				return res.send('Success!!');
			}
		});
	});

	router.get('/failure', function (req, res) {
		console.log('default fail page');
	  res.redirect('/login');
	});

	return router;
})();