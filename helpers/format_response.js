var Promise = require('bluebird'),
	models = require('../models/models'),
	json2html = require('node-json2html'),
	js2xmlparser = require('js2xmlparser'),
	fullPage = require('./generate_full_page');

module.exports = {
	formatResponse: function(res, data) {
		return new Promise(function(resolve){
			res.format({
				json: function() {
					res.set('Content-Type', 'application/json');
					return resolve(res.send(data));
				},
				html: function(){
					res.set('Content-Type', 'text/html');
					var type
					var single
					if (data instanceof Array){
						type = data[0].type
						single = false
					} else {
						type = data.type
						single = true
					}
					var html
					switch(type) {
						case "element":
							transform = {'tag':'div','html':'${content}'};
							html = json2html.transform(data, transform)
							return resolve(res.end(html, 'utf-8'))	
							break;
						case "content":
							transform = {'tag':'div','html':'${content}'};
							html = json2html.transform(data, transform)
							return resolve(res.end(html, 'utf-8'))	
							break;
						case "position":
							return res.send("Only JSON and XML are available for this type, please specify .json or .xml");
							break;
						case "page":
							return fullPage.returnFullHtml(res, data, single).then(function(html){
								return resolve(res.end(html, 'utf-8'))
							});
						default:
							return res.send("improper type");
					}
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
				},
			});
		});
	}
}