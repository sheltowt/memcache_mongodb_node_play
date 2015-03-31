var Promise = require('bluebird'),
	async = require('async'),
	json2html = require('node-json2html'),
	models = require('../models/models');

var retrieveElement = function(elementId, callback) {
	process.nextTick(function() {
		models.ElementModel.findOne({elementId: elementId}, function(err, data){
			if (data) {
				callback(null, data)
			} else {
				callback(err, null)
			}
		})
	})
}

var returnAllElements = function(page, callback){
	process.nextTick(function(){
		async.map(page.elementIds, retrieveElement.bind(retrieveElement), function(err, result){
			console.log(result)
			if (err){
				callback(null, "empty")
			} else {
				if (result[0]){
					transform = {'tag':'div','html':'${content}'};
					html = json2html.transform(result, transform)
					callback(null, html)
				} else {
					callback(null, "empty")
				}
			}
		})
	})
}

var returnAllElementsPromise = function(page){
	return new Promise(function(resolve){
		async.map(page.elementIds, retrieveElement.bind(retrieveElement), function(err, result){
			transform = {'tag':'div','html':'${content}'};
			html = json2html.transform(result, transform)		
			resolve(html)
		})
	})
}

var returnAllPages = function(pages){
	return new Promise(function(resolve){
		async.map(pages, returnAllElements.bind(returnAllElements), function(err, htmlArray){
			resolve(htmlArray)
		})
	})
}


module.exports = {
	returnFullHtml: function(res, pages, single) {
		return new Promise(function(resolve){
			if (single) {
				returnAllElementsPromise(pages).then(function(html){
					resolve(html)
				})
			} else {
				returnAllPages(pages).then(function(html){
					htmlStart = ""
					for (var i = 0; i < html.length; i++) {
						if (html[i] != "empty"){
							htmlStart += "<h1> NEW PAGE <h1>"
							htmlStart += html[i]
						}
					}
					console.log(htmlStart)
					resolve(htmlStart)
				})
			}
		})
	}
}