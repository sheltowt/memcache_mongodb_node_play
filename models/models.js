var mongoose = require('mongoose'),
	autoIncrement = require('mongoose-auto-increment'),
	connection = mongoose.connect('mongodb://localhost/workers');

module.exports = (function() {
	autoIncrement.initialize(connection);

	var Schema = mongoose.Schema; 

	var Page = new Schema({
		id: Schema.Types.ObjectId,
		elementIds: Array,  
    modified: { type: Date, default: Date.now }
	});

	var Element = new Schema({
		id: Schema.Types.ObjectId,
		content: String,
		positionId: Number,
		contentId: Number,  
    modified: { type: Date, default: Date.now }
	});

	var Position = new Schema({
		id: Schema.Types.ObjectId,
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
		type: String,
		elementId: Number,
    modified: { type: Date, default: Date.now }
	});


	Page.plugin(autoIncrement.plugin, 'PageModel');
	Element.plugin(autoIncrement.plugin, 'ElementModel');
	Position.plugin(autoIncrement.plugin, 'PositionModel');
	Content.plugin(autoIncrement.plugin, 'ContentModel');

	var models = {
		PageModel: connection.model('Page', Page),
		ElementModel: connection.model('Element', Element)
		Position: connection.model('Position', Position),
		Content: connection.model('Content', Content)
	}

	return models;

})();