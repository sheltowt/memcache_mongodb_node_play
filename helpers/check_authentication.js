var Promise = require('bluebird'),
  passport = require('passport'),
	models = require('../models/models');

var getUser = function(req) {
	return new Promise(function(resolve){
		if (req.isAuthenticated()){
			resolve(true)
		} else {
			resolve(false)
		}
	})
}

module.exports = {
	ensureAuthenticated: function(req, res) {
		return new Promise(function(resolve){
			getUser(req).then(function(facebookAuth){
				if (facebookAuth){
					resolve(true);
				} else {
					if(req.cookies.access_token) {
				  	return models.UserModel.findOne({uniqueAccessToken: req.cookies.access_token}, function(err, user){
					  	if (err){
					  		resolve(false);
					  	} else if (user){
					  		resolve(true);
					  	} else {
					  		resolve(false);
					  	}
				  	})
					} else {
						resolve(false);
					}
				}
			})
		})
	}
}