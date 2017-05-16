var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var user_schema = new Schema({
	username:String,
	hash: String,
	salt:String
});
module.exports = mongoose.model('UserSchema', user_schema);