var User = require('../lib/user');
exports.form = function(req, res){
	if(req.session.error==null){
		req.session.error = "";
	}
	res.render('login', { message: req.session.error,title:'login' });
	req.session.error="";
};
exports.submit =  function(req,res){
	var form = req.body.user
	user = new User({
		name: form.username,
		pass: form.password
	});
	user.authenticate(user.name,user.pass,function(err,returnuser){
		if (returnuser==null){
			
			req.session.error = 'Incorrect username or password';
			return res.redirect('/login');
		}else{
			
			req.session.uid = returnuser.username;
			return res.redirect('/generatekey');
			
		}
	});
}