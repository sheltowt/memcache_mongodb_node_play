var Promise = require('bluebird'),
	models = require('../models/models'),
	js2xmlparser = require('js2xmlparser');

module.exports = {
	formatResponse: function(res, data) {
		return new Promise(function(resolve){
			res.format({
				json: function() {
					res.set('Content-Type', 'application/json');
					return resolve(res.send(data))
				},
				xml: function() {
					res.set('Content-Type', 'text/xml');
					master = {}
					master["data"] = data
					data = JSON.stringify(master)
					options = {}
					options["declaration"] = {}
					options["declaration"]["include"] = false
					var xmlData = js2xmlparser("data", data, options)
					return resolve(res.send(xmlData))
				}
			})
		})
	}
}