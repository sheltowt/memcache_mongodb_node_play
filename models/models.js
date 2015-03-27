var mongoose = require('mongoose'),
	autoIncrement = require('mongoose-auto-increment'),
	connection = mongoose.connect('mongodb://localhost/weebly'),
	findOrCreate = require('mongoose-findorcreate');

module.exports = (function() {
	autoIncrement.initialize(connection);

	var Schema = mongoose.Schema; 

	var User = new Schema({
		id: Schema.Types.ObjectId,
		openId: String,
		googleId: String,
		googleIdToken: String,
		googleAccessToken: String,
		uniqueAccessToken: String,
		facebookId: String,
		name: String,
		admin: Boolean,
	})

	var Page = new Schema({
		id: Schema.Types.ObjectId,
		ownerId: Number,
		elementIds: Array,  
    modified: { type: Date, default: Date.now }
	});

	var Element = new Schema({
		id: Schema.Types.ObjectId,
		ownerId: Number,
		pageId: Number,
		content: String,
		positionId: Number,
		contentId: Number,  
    modified: { type: Date, default: Date.now }
	});

	var Position = new Schema({
		id: Schema.Types.ObjectId,
		ownerId: Number,
		elementId: Number,
		positionType: String,
		top: Number,
		bottom: Number,
		left: Number,
		right: Number, 
    modified: { type: Date, default: Date.now }
	});

	var Content = new Schema({
		id: Schema.Types.ObjectId,
		ownerId: Number,
		type: String,
		elementId: Number,
    modified: { type: Date, default: Date.now }
	});

	User.plugin(autoIncrement.plugin, 'UserModel');
	User.plugin(findOrCreate)
	Page.plugin(autoIncrement.plugin, 'PageModel');
	Element.plugin(autoIncrement.plugin, 'ElementModel');
	Position.plugin(autoIncrement.plugin, 'PositionModel');
	Content.plugin(autoIncrement.plugin, 'ContentModel');

	var models = {
		UserModel: connection.model('User', User),
		PageModel: connection.model('Page', Page),
		ElementModel: connection.model('Element', Element),
		PositionModel: connection.model('Position', Position),
		ContentModel: connection.model('Content', Content)
	}

	return models;

})();