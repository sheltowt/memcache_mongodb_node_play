var Promise = require('bluebird'),
	async = require('async'),
	json2html = require('node-json2html'),
	models = require('../models/models');

//collect all of elements into an array
//iterate through and add all of them together
// return html
// var callback = function(data){
// 	return data
// }

var retrieveElement = function(elementId, callback) {
	process.nextTick(function() {
		models.ElementModel.findOne({elementId: elementId}, function(err, data){
			callback(null, data)
		})
	})
}

var returnAllElements = function(page){
	return new Promise(function(resolve){
		console.log(page)
		async.map(page.elementIds, retrieveElement.bind(retrieveElement), function(err, result){
			console.log(err)
			console.log(result)
			transform = {'tag':'div','html':'${content}'};
			html = json2html.transform(result, transform)			
			return resolve(html)
		})
	})
}

// var returnAllPages = function(pages){
// 	return new Promise(function(resolve){
// 		async.map
// 	})
// }


module.exports = {
	returnFullHtml: function(res, page) {
		return new Promise(function(resolve){
			returnAllElements(page[0]).then(function(html){
				console.log(html)
				resolve(html)
			})
		})
	}
}