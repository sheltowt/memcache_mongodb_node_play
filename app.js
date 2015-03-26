var application_root = __dirname, 
	express = require("express"),
	path = require("path"),
	http = require("http"),
	bodyParser = require('body-parser'),
	models = require('./models/mdoels');

var app = express();
app.use(bodyParser.json())

app.use(express.static(path.join(application_root, "public")));

var server = http.createServer(app);

server.listen(3000);
