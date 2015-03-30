var Router = require('router'),
  helpers = require('../helpers/check_authentication'),
  models = require('../models/models'),
  http = require('http'),
  memcachedInterface = require('../helpers/memcached'),
  generateFullPage = require('../helpers/generate_full_page'),
  formatter = require('../helpers/format_response');

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
						return formatter.formatResponse(res, pages).then(function(response){
							return response
						})
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
					elementIds: req.body.elementIds,
					ownerId: req.body.ownerId,
					pageId: req.body.pageId
				});
				return page.save(function(err, pageData){
					if (!err) {
						return formatter.formatResponse(res, pageData).then(function(response){
							return response
						})
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
				memcachedString = "pages" + req.params.id.toString()
				return memcachedInterface.getMemcached(memcachedString).then(function(data){
					if (data) {
						return formatter.formatResponse(res, data).then(function(response){
							return response
						})
					} else {
						return models.PageModel.findOne({pageId: req.params.id}, function(err, pageData){
							if (!err){
								return memcachedInterface.setMemcached(memcachedString, pageData).then(function(){
									return formatter.formatResponse(res, pageData).then(function(response){
										return response
									})
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
						page = new models.PageModel({
							elementIds: req.body.elementIds,
							ownerId: req.body.ownerId,
							pageId: req.body.pageId
						});
						page.save();
						return formatter.formatResponse(res, page).then(function(response){
							return response
						})
					} else {
						return res.send("Failed to find page " + req.params.id)
					}
				})		
			}
		})
	})

	router.delete('/pages/:id', function (req, res){
		console.log('DELETE /api/page/id');
		return helpers.ensureAuthenticated(req, res).then(function(authenticated){
			if(!authenticated){
				return res.redirect('/login');
			} else {
			  return models.PageModel.findById(req.params.id, function (err, page) {
			    return page.remove(function (err) {
			      if (!err) {
			        memcachedKey = "page" + req.params.id.toString()
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
		console.log(req.params.id)
	  res.writeHead(200, { 'Content-Type': 'text/html'});
	  var html = '<!DOCTYPE html><html><head><title>My Title</title></head><body>';
	  return models.PageModel.findOne({pageId: req.params.id}, function (err, page) {
	    if (!err) {
	      return generateFullPage.returnFullHtml(page.elementIds, html).then(function(html){
	      	html += '</body></html>';
	  			return res.end(html, 'utf-8');
	      })
	    } else {
	      return console.log(err);
	    }
	  });
	});

	router.get('/elements', function (req, res){
		console.log('GET /api/elements');
		return helpers.ensureAuthenticated(req, res).then(function(authenticated){
			if(!authenticated){
				return res.redirect('/login');
			} else {
			  return models.ElementModel.find(function (err, elements) {
			    if (!err) {
						return formatter.formatResponse(res, elements).then(function(response){
							return response
						})
			    } else {
			      return console.log(err);
			    }
			  });
			}
		});
	});

	router.get('/positions', function (req, res){
		console.log('GET /api/positions');
		return helpers.ensureAuthenticated(req, res).then(function(authenticated){
			if(!authenticated){
				return res.redirect('/login');
			} else {
			  return models.PositionModel.find(function (err, positions) {
			    if (!err) {
						return formatter.formatResponse(res, positions).then(function(response){
							return response
						})
			    } else {
			      return console.log(err);
			    }
			  });
			}
		});
	});

	router.get('/contents', function (req, res){
		console.log('GET /api/contents');
		return helpers.ensureAuthenticated(req, res).then(function(authenticated){
			if(!authenticated){
				return res.redirect('/login');
			} else {
			  return models.ContentModel.find(function (err, contents) {
			    if (!err) {
						return formatter.formatResponse(res, contents).then(function(response){
							return response
						})
			    } else {
			      return console.log(err);
			    }
			  });
			}
		});
	});

	return router;
})();