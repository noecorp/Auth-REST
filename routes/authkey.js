var mongoose = require('mongoose')
var User = require('../lib/user');
exports.auth = function (req,res,next) {
	if(req.query['api-key']){
		var user = new User({});
		var id = req.query['api-key'];
		user.getByMongoId(id,function(err,returnuser){
			if(returnuser==null){
				return res.status(400).json({status: 'Invalid Auth Key'})
			}else{
				next();
			}
		})
		
	}else{
		return res.status(401).json({status: 'Please Provide Auth Key'})
	}
}