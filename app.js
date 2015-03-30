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
	googleAuth = require('./routes/google_auth'),
	facebookAuth = require('./routes/facebook_auth'), 
	passport = require('passport');

var app = express();
app.use(bodyParser.json())

app.use(express.static(path.join(application_root, "public")));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', api);
app.use('/auth/google', googleAuth);
app.use('/auth/facebook', facebookAuth);

app.get('/', function (req, res) {
	console.log('default page');
  res.send('default page');
});

app.get('/login', function (req, res) {
	res.sendFile(__dirname+'/public/index.html');
});

app.get('/logout', function(req, res){
  // req.logout();
  res.clearCookie('access_token');
  res.send('You are successfully logged out');
});

app.get('/status', function (req, res) {
	console.log('Weebly private is running');
  res.send('Weebly private is running');
});


var server = http.createServer(app);

server.listen(3000);
