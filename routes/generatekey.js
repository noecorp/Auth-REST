var User = require('../lib/user');
exports.generate = function(req, res){
	console.log(req.session.apikey);
	if(req.session.apikey==null){
		req.session.apikey = "";
	}

	res.render('generatekey', { title: 'Generate Key',message:req.session.apikey});
	
};
exports.apikey = function(req, res){
	var user = new User({});
	user.getById(req.session.uid,function (err,returnuser){
		
		req.session.apikey = 'Your API Key : '+returnuser._id;
		return res.redirect('/generatekey');
 	})
 	
	
};