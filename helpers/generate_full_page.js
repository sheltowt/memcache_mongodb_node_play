var Promise = require('bluebird'),
	models = require('../models/models');

var counter = Promise.method(function(i){
    return i++;
})

var getData = function(elementIds, i, ){
	return new Promise(function(resolve){

	})
}

function getAll(max, results){
    var results = results || [];
    return counter().then(function(result){
        results.push(result);
        return (result < max) ? getAll(max, results) : results
    })
}

module.exports = {
	returnFullHtml: function(elementIds, html) {
		var i = 0;
		var max = len(elementIds)
		getAll(10).then(function(data){
    	console.log(data);
		})
	}
}