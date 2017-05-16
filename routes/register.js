var User = require('../lib/user');
exports.registerform = function(req,res){
	if(req.session.error==null){
		req.session.error = "";
	}
	res.render('register',{message: req.session.error});
	req.session.error="";
}
exports.submitform =  function(req,res){
	var form = req.body.user
	user = new User({
		name: form.username,
		pass: form.password
	});
	user.authenticate(user.name,user.pass,function(err,returnuser){
		if (returnuser!=null){
			req.session.error = 'Username Already Taken';
			return res.redirect('back');
		}else{
			user.save(function(err) {
				if (err) return next(err);
				req.session.uid = user.name;
				
			});
			return res.redirect('/login');
		}
	});
}