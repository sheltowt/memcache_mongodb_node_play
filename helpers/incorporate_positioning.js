var Promise = require('bluebird'),
	models = require('../models/models');

var getPosition = function(element) {
	return new Promise(function(resolve){
		models.PositionModel.findOne({elementId: element.elementId}, function(err, data){
			resolve(data);
		});
	});
}

module.exports = {
	incorporatePositioning: function(element) {
		return new Promise(function(resolve){
			return getPosition(element).then(function(position){
				positioning = "<style>"
				positioning += "#div" + position.elementId + " {"
				positioning += "position: " + position.positionType + "; "
				positioning += "top: " + position.top + "px; "
				positioning += "bottom: " + position.bottom + "px; "
				positioning += "left: " + position.left + "px; "
				positioning += "right: " + position.right + "px; }"
				positioning += "</style>"
				element.content = element.content + positioning
				resolve(element)
			});
		});
	}
}