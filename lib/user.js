var mongoose = require('mongoose');
var crypt_password= require('bcrypt');



var db = mongoose.connect('mongodb://localhost/users');
var user_schema=require('./user_schema.js')


function User(obj) {
	for (var key in obj) {
		this[key] = obj[key];
	}

}
var user_model = mongoose.model('UserSchema');

User.prototype.update = function(func){
	var user = this;
	var id = user.userid;
	user.makehash(function (err) {
		user_model.findOneAndUpdate({userid:id},{$set: {username:user.name,hash:user.pass,salt:user.salt}},{new:true},function (err,doc) {
			if (err) {return func(err)};
			console.log(doc);
		});
	});
	
};
User.prototype.makehash = function(func){
	var current = this;
	crypt_password.genSalt(10, function(err, salted){
		if (err) return func(err);
		current.salt = salted;
		crypt_password.hash(current.pass, salted, function(err, hash){
			if (err) return func(err);
			current.pass = hash;
			func();
		});
	});
};
User.prototype.save = function(fn){
	var user = this;
	user_model.count({'username': this.userid}, function(err, count) {
		if(err) return fn(err);
		if(count>0){
			user.update(fn);
		}else{
			
			user.makehash(function(err){
				if(err) return fn(err);
				var newuser= new user_model();
				newuser.username = user.name;
				newuser.hash=user.pass;
				newuser.salt=user.salt;
				newuser.save(function(err) {
					if (err) return fn(err);
					
				});
			});
			
		}
	});
};
User.prototype.getById = function(id, fn){
	user_model.find({'username': id}, function(err, user) {
		if(user.length==0){
			fn(null,null);
		}else{
			fn(null,new User(user[0]));
		}
		
	});
};
User.prototype.getByMongoId = function(id, fn){
	user_model.find({'_id': id}, function(err, user) {
		if(user.length==0){
			fn(null,null);
		}else{
			fn(null,new User(user[0]));
		}
		
	});
};
User.prototype.authenticate = function(id, pass, fn){
	this.getById(id, function(err, user){
		if (err) return fn(err);
		if (user==null) {return fn('no such user',null)};
		crypt_password.hash(pass, user.salt, function(err, hash){
			if (err) return fn(err);
			if (hash == user.hash) {
				console.log(user.username)
				return fn(null, user)
			};
			fn();
		});
	});
};
module.exports = User;
var tobi = new User({});
// // tobi.save(function(err){
// // 	if (err) throw err;
// // 	//console.log('user id', tobi.id);
// // });
// tobi.authenticate('lebron james','123',function(err,user){
// 	if (err=='no such user'){console.log('cool bro')}
// 	console.log('user id ', user.hash);
// });
