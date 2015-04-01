var apiBenchmark = require('api-benchmark');

var service = {
	server1: "http://localhost:3000/api/"
};

var routes = { route1: "pages/1", route2: "pages/2", route3: "pages/3", route4: "pages/4", route5: "pages/5", route6: "pages/6", route7: "pages/7", route8: "pages/8"};

var options = {debug: true, minSamples: 50, maxTime: 5};

apiBenchmark.measure(service, routes, options, function(err, results){
	console.log(err, results);
});