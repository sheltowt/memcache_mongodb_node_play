var Promise = require('bluebird'),
	async = require('async'),
	json2html = require('node-json2html'),
	positioning = require('./incorporate_positioning'),
	content = require('./inject_content'),
	models = require('../models/models');

var retrieveElement = function(elementId, callback) {
	process.nextTick(function() {
		models.ElementModel.findOne({elementId: elementId}, function(err, data){
			if (data) {
				positioning.incorporatePositioning(data).then(function(element){
					content.injectContent(element).then(function(data){
						callback(null, data)
					})
				})
			} else {
				callback(err, null)
			}
		});
	});
}

var returnAllElements = function(page, callback){
	process.nextTick(function(){
		async.map(page.elementIds, retrieveElement.bind(retrieveElement), function(err, result){
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
		});
	});
}

var returnAllElementsPromise = function(page){
	return new Promise(function(resolve){
		async.map(page.elementIds, retrieveElement.bind(retrieveElement), function(err, result){
			transform = {'tag':'div','html':'${content}'};
			html = json2html.transform(result, transform)		
			resolve(html)
		});
	});
}

var returnAllPages = function(pages){
	return new Promise(function(resolve){
		async.map(pages, returnAllElements.bind(returnAllElements), function(err, htmlArray){
			resolve(htmlArray)
		});
	});
}

var headerString = "<head><title>The Entrar-shadow Website form | w3layouts</title><meta charset=\"utf-8\"><link href=\"localhost:3000/css/pages.css\" rel='stylesheet' type='text/css' /><meta name='viewport' content='width=device-width, initial-scale=1'><script type='application/x-javascript'> addEventListener('load', function() { setTimeout(hideURLbar, 0); }, false); function hideURLbar(){ window.scrollTo(0,1); } </script><!--webfonts--><link href='http://fonts.googleapis.com/css?family=Open+Sans:600italic,400,300,600,700' rel='stylesheet' type='text/css'><!--//webfonts--></head>"

module.exports = {
	returnFullHtml: function(res, pages, single) {
		return new Promise(function(resolve){
			if (single) {
				returnAllElementsPromise(pages).then(function(html){
					newString = ""
					newString += headerString
					newString += html
					resolve(newString)
				});
			} else {
				returnAllPages(pages).then(function(html){
					htmlStart = ""
					for (var i = 0; i < html.length; i++) {
						if (html[i] != "empty"){
							htmlStart += headerString
							htmlStart += "<h1> NEW PAGE <h1>"
							htmlStart += html[i]
						}
					}
					resolve(htmlStart)
				});
			}
		});
	}
}