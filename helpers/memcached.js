var Memcached = require('memcached'),
	Promise = require('bluebird');

var memcached = new Memcached('localhost:11211', {retries:10,retry:10000});

memcached.connect( '127.0.0.1:11211', function( err, conn ){
  if( err ) throw new Error( err );
  console.log( conn.server );
});

module.exports = {
	setMemcached: function(key, value) {
		return new Promise(function(resolve){
			return memcached.set(key, value, 60000, function(err){
				if (err) {
					console.log("error setting key", err);
					resolve(false)
				} else {
					console.log(key, value, "successfully set key");
					resolve(true)
				}
			})
		})
	},
	getMemcached: function(key) {
		return new Promise(function(resolve){
			return memcached.get(key, function (err, data) {
				if (err) {
					console.log(err)
					resolve(null)
				} else if (data) {
					resolve(data)
				} else {
					resolve(null)
				}
			});
		})
	},
	replaceMemcached: function(key, value) {
		return new Promise(function(resolve){
			return memcached.replace(key, value, 60000, function(err){
				if (err) {
					console.log("error with setting key", err);
					resolve(false)
				} else {
					console.log(key, value, "successfully set");
					resolve(true)
				}				
			})
		})

	},
	deleteMemcached: function(key, value) {
		return new Promise(function(resolve){
			return memcached.del(key, function(err){
				if (err) {
					console.log("error deleting key", err);
					resolve(false)
				} else {
					console.log(key, value, "successfully deleted key");
					resolve(true)
				}
			})
		})
	}
}