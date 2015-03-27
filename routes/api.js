var Router = require('router'),
  helpers = require('../helpers/check_authentication'),
  models = require('../models/models'),
  http = require('http'),
  memcachedInterface = require('../helpers/memcached');

module.exports = (function() {
	var router = Router();

	router.get('/pages', function (req, res){
		console.log('GET /api/pages');
		return helpers.ensureAuthenticated(req, res).then(function(authenticated){
			if(!authenticated){
				return res.redirect('/login');
			} else {
				return models.PageModel.find(function (err, pages) {
			    if (!err) {
			      return res.send(pages);
			    } else {
						console.log(err);
						return res.send('Request failed');
			    }
	  		});
			}
		});
	});

	router.post('/pages', function (req, res){
		console.log('POST /api/pages');
		return helpers.ensureAuthenticated(req, res).then(function(authenticated){
			if(!authenticated){
				return res.redirect('/login');
			} else {
				page = new models.PageModel({
					elementIds: req.body.elementIds
				});
				return page.save(function(err, pageData){
					if (!err) {
						return res.send(pageData)
					} else {
						return res.send('Update failed');					
					}
				})
			}
		});
	});

	router.get('/pages/:id', function(req, res){
		console.log('GET /api/pages/:id')
		return helpers.ensureAuthenticated(req, res).then(function(authenticated){
			if(!authenticated){
				return res.redirect('/login');
			} else {
				memcachedString = "pages" + str(req.params.id)
				return memcachedInterface.getMemcached(memcachedString).then(function(data){
					if (data) {
						res.send(data)
					} else {
						return models.PageModel.findById(req.params.id, function(err, pageData){
							if (!err){
								return memcachedInterface.setMemcached(memcachedString, pageData).then(function(){
									return res.send(jobData)
								});
							} else {
								return res.send("Failed to find page " + req.params.id)
							}
						})	
					}
				})		
			}
		})

	})

	router.put('/pages/:id', function(req, res){
		console.log('PUT /api/pages/:id')
		return helpers.ensureAuthenticated(req, res).then(function(authenticated){
			if(!authenticated){
				return res.redirect('/login');
			} else {
				return models.PageModel.findById(req.params.id, function(err, page){
					if (!err && (page != null)){
						return res.send(jobData);
					} else {
						return res.send("Failed to find page " + req.params.id)
					}
					return page.save(function (err) {
						if (!err) {

						}
					})
				})		
			}
		})
	})

	router.delete('/page/:id', function (req, res){
		console.log('DELETE /api/page/id');
		return helpers.ensureAuthenticated(req, res).then(function(authenticated){
			if(!authenticated){
				return res.redirect('/login');
			} else {
			  return models.PageModel.findById(req.params.id, function (err, page) {
			    return page.remove(function (err) {
			      if (!err) {
			        console.log("removed");
			        memcachedKey = "page" + str(req.params.id)
							return memcachedInterface.deleteMemcached(memcachedKey, page).then(function(status){
								console.log(status)
								return res.send('');
							})			        
			      } else {
			        console.log(err);
			      }
			    });
			  });
			}
		});
	});

	router.get('/fullPage/:id', function (req, res){
		console.log('GET /api/fullPage/:id');
	  res.writeHead(200, { 'Content-Type': 'text/html'});
	  var html = '<!DOCTYPE html><html><head><title>My Title</title></head><body>';
	  return models.ElementModel.find(function (err, elements) {
	    if (!err) {
	      return res.send(elements);
	    } else {
	      return console.log(err);
	    }
	  });
	  html += '</body></html>';
	  res.end(html, 'utf-8');
	});

	router.get('/elements', function (req, res){
		console.log('GET /api/elements');
	  return models.ElementModel.find(function (err, elements) {
	    if (!err) {
	      return res.send(elements);
	    } else {
	      return console.log(err);
	    }
	  });
	});

	router.get('/positions', function (req, res){
		console.log('GET /api/positions');
	  return models.PageModel.find(function (err, pages) {
	    if (!err) {
	      return res.send(positions);
	    } else {
	      return console.log(err);
	    }
	  });
	});

	router.get('/contents', function (req, res){
		console.log('GET /api/elements');
	  return models.PageModel.find(function (err, contents) {
	    if (!err) {
	      return res.send(contents);
	    } else {
	      return console.log(err);
	    }
	  });
	});

	return router;
})();