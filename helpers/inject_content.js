var Promise = require('bluebird'),
	models = require('../models/models');

var getContent = function(element) {
	return new Promise(function(resolve){
		models.ContentModel.findOne({elementId: element.elementId}, function(err, data){
			resolve(data);
		});
	});
}

module.exports = {
	injectContent: function(element) {
		return new Promise(function(resolve){
			return getContent(element).then(function(content){
				splitElement = element.content.split("XXXXX");
				if (splitElement.length == 2){
					element.content = splitElement[0] + content.content + splitElement[1]
					resolve(element)
				} else {
					resolve(element)
				}
			});
		});
	}
}