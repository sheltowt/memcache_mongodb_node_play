var Promise = require('bluebird'),
	models = require('../models/models');

module.exports = {
	returnFullHtml: function(elementIds, html) {
		console.log(elementIds)
		return new Promise(function(resolve){
			var i = 0;
			for (var i = 0; i < elementIds; i++) {
				models.ElementModel.findOne({elementId: elementIds[i]}, function (err, element) {
					consol.log(err, element)
					if (!err) {
						html = html + element.content
					}
					console.log(element)
				})
			}
			return setTimeout(function(html){
				console.log(html)
				return resolve(html)
			}, 30000);
		})
	}
}