var application_root = __dirname, 
	express = require("express"),
	path = require("path"),
	http = require("http"),
	bodyParser = require('body-parser'),
	models = require('./models/models'),
	passport = require('passport'),
	google = require('googleapis'),
	OAuth2 = google.auth.OAuth2,
	config = require('./config.json'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	url = require('url'), 
	hat = require('hat'), 
	Promise = require('bluebird');

var app = express();
app.use(bodyParser.json())

var oauth2Client = new OAuth2(config.client_id, config.client_secret, "http://127.0.0.1:3000/auth/google/callback")

app.use(express.static(path.join(application_root, "public")));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

var scopes = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/calendar',
  'https://www.google.com/m8/feeds',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'

];

app.get('/auth/google', function (req, res) {
	url = oauth2Client.generateAuthUrl({
	  access_type: 'offline', 
	  scope: scopes 
	});
	res.redirect(url);
});

app.get( '/auth/google/callback', function (req, res) {
	oauth2Client.getToken(req.query.code, function(err, tokens) {
	  firstChunk = tokens.id_token.split(".")[0]
	  if(!err) {
	    oauth2Client.setCredentials(tokens);
	    return models.UserModel.findOrCreate({googleId: firstChunk}, {accessToken: tokens.access_token, id_token: tokens.id_token}, function(err, user, created){
	    	if (created == true){
	    		uniqueId = hat();
	    		models.UserModel.findByIdAndUpdate({googleId: firstChunk}, {$set: {uniqueAccessToken: uniqueId, idToken: tokens.id_token, accessToken: tokens.access_token}}, function(err, user) {
	    			console.log(err, user)
	    		})
	    	} else {
	    		models.UserModel.update({googleId: firstChunk}, {$set: {idToken: tokens.id_token, accessToken: tokens.access_token}}, function(err, user) {
	    			console.log(err, user)
	    		})
	    	}
	    	res.cookie('access_token', tokens.access_token, { maxAge: 900000, httpOnly: true });
	    	return res.redirect('/auth/google/success');
	    })
	  }
	});
});

function ensureAuthenticated(req, res, callback) {
	return new Promise(function())
  cookie = req.cookies.access_token;
  models.UserModel.findOne({idToken: cookie}, function(err, user){
  	if (err){
  		return false
  	} else if (user){
  		return true
  	} else {
  		return false
  	}
  })
}


app.get('/auth/google/success', function (req, res) {
	console.log('default page');
  res.send('you are successfully logged in');
});

app.get('/auth/google/practice', function (req, res) {
	authentication = ensureAuthenticated(req, res);
	console.log(authentication);
  res.send('you are successfully logged in');
});

app.get('/auth/google/failure', function (req, res) {
	console.log('default fail page');
  res.redirect('/login');
});

app.get('/', function (req, res) {
	console.log('default page');
  res.send('default page');
});

app.get('/login', function (req, res) {
	res.sendFile(__dirname+'/public/index.html', { user: req.user });
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/', { user: req.user });
});

app.get('/status', function (req, res) {
	console.log('Weebly private is running');
  res.send('Weebly private is running');
});

app.get('/api/pages', function (req, res){

	console.log('GET /api/pages');
  return models.PageModel.find(function (err, pages) {
    if (!err) {
      return res.send(pages);
    } else {
      return console.log(err);
    }
  });
});

app.get('/api/elements', function (req, res){
	console.log('GET /api/elements');
  return models.ElementModel.find(function (err, elements) {
    if (!err) {
      return res.send(elements);
    } else {
      return console.log(err);
    }
  });
});

app.get('/api/positions', function (req, res){
	console.log('GET /api/positions');
  return models.PageModel.find(function (err, pages) {
    if (!err) {
      return res.send(positions);
    } else {
      return console.log(err);
    }
  });
});

app.get('/api/contents', function (req, res){
	console.log('GET /api/elements');
  return models.PageModel.find(function (err, contents) {
    if (!err) {
      return res.send(contents);
    } else {
      return console.log(err);
    }
  });
});

var server = http.createServer(app);

server.listen(3000);
