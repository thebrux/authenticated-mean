var mongoose = require('mongoose');
//var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
	name: String,
	photoUrl: String,
	local            : {
		email        : String,
		password     : String
	},
	facebook         : {
		id           : String,
		token        : String,
		email        : String,
		name         : String,
		photoUrl     : String
	},
	twitter          : {
		id           : String,
		token        : String,
		displayName  : String,
		username     : String,
		photoUrl     : String
	},
	google           : {
		id           : String,
		token        : String,
		email        : String,
		name         : String,
		photoUrl      : String
	}

});

// TODO: Add if we add local login support
// generating a hash
//userSchema.methods.generateHash = function(password) {
//	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
//};

// checking if password is valid
//userSchema.methods.validPassword = function(password) {
//	return bcrypt.compareSync(password, this.local.password);
//};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
