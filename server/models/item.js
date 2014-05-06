var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
	userId: mongoose.Schema.Types.ObjectId,
	name: String
});
module.exports = mongoose.model('Item', itemSchema);
