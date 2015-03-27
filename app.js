var application_root = __dirname, 
	express = require("express"),
	path = require("path"),
	http = require("http"),
	bodyParser = require('body-parser'),
	models = require('./models/models'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	url = require('url'), 
	Promise = require('bluebird'),
	api = require('./routes/api'),
	googleAuth = require('./routes/google_auth');

var app = express();
app.use(bodyParser.json())

app.use(express.static(path.join(application_root, "public")));
app.use(cookieParser());

app.use('/api', api);
app.use('/auth/google', googleAuth);

app.get('/', function (req, res) {
	console.log('default page');
  res.send('default page');
});

app.get('/login', function (req, res) {
	res.sendFile(__dirname+'/public/index.html', { user: req.user });
});

app.get('/logout', function(req, res){
  req.logout();
  res.clearCookie('access_token');
  res.redirect('/', { user: req.user });
});

app.get('/status', function (req, res) {
	console.log('Weebly private is running');
  res.send('Weebly private is running');
});


var server = http.createServer(app);

server.listen(3000);
