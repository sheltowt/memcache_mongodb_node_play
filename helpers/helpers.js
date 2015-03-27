var Promise = require('bluebird'),
	models = require('../models/models');

module.exports = {
	ensureAuthenticated: function(req, res) {
		return new Promise(function(resolve){
			cookie = req.cookies.access_token;
	  	return models.UserModel.findOne({accessToken: cookie}, function(err, user){
		  	if (err){
		  		resolve(false);
		  		console.log(err)
		  	} else if (user){
		  		resolve(true);
		  	} else {
		  		resolve(false);
		  	}
	  	})
		})
	}
}