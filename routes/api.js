var Router = require('router'),
  helpers = require('../helpers/check_authentication'),
  models = require('../models/models'),
  memcacheInterface = require('../helpers/memcached');

module.exports = (function() {
	var router = Router();
	memcacheInterface.setMemcached("Yeah", "Yeah")

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
				return models.PageModel.findById(req.params.id, function(err, pageData){
					if (!err){
						return res.send(jobData);
					} else {
						return res.send("Failed to find page " + req.params.id)
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

	router.delete('/jobs/:id', function (req, res){
		console.log('DELETE /api/jobs/id');
		return helpers.ensureAuthenticated(req, res).then(function(authenticated){
			if(!authenticated){
				return res.redirect('/login');
			} else {
			  return models.JobModel.findById(req.params.id, function (err, job) {
			    return job.remove(function (err) {
			      if (!err) {
			        console.log("removed");
			        return res.send('');
			      } else {
			        console.log(err);
			      }
			    });
			  });
			}
		});
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