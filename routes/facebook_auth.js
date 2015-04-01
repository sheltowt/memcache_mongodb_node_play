var Router = require('router'),
  models = require('../models/models'),
  passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  cookieParser = require('cookie-parser'),
  config = require('../config.json'),
  hat = require('hat'),
  helpers = require('../helpers/check_authentication');

module.exports = (function() {
	var router = Router();

	passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
	  done(null, obj);
	});

	passport.use(new FacebookStrategy({
			clientID: config.facebook_id,
			clientSecret: config.facebook_app_secret,
			callbackURL: "http://localhost:3000/auth/facebook/callback"
		}, 
		function(accessToken, refreshToken, profile, done){
			return models.UserModel.findOrCreate({facebookId: profile.id}, function(err, user, created){
				if (err) {
					return res.redirect('/login');
				}
				if (created == true){
					uniqueId = hat();
					cookieId = uniqueId
					models.UserModel.update({facebookId: user.facebookId}, {$set: {uniqueAccessToken: uniqueId}}, function(err, user){
						return done(null, profile);
					});
				} else {
					return done(null, profile);
				}
			});
		}
	));

	router.get('/', passport.authenticate('facebook'), function(req, res){
		
	});

	router.get('/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
  	function(req, res) {
    	res.redirect('http://localhost:3000/auth/facebook/success');
  });

	router.get('/success', function(req, res) {
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