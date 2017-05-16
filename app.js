
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , register = require('./routes/register')
  , login = require('./routes/login')
  , apikey = require('./routes/generatekey')
  , todoList = require('./routes/api.js')
  , authkey = require('./routes/authkey.js')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  
});

app.configure('development', function(){
  app.use(express.errorHandler());
});
app.all('/api/*', authkey.auth);
app.get('/', routes.index);
app.get('/users', user.list);
app.get('/register', register.registerform);
app.post('/register', register.submitform);
app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/generatekey', apikey.generate);
app.post('/generatekey', apikey.apikey);
// app.get('/api/*',function(req,res){
//   res.render('index',{title:'express'})
// })
app.get('/api/tasks',todoList.list_all_tasks)
app.post('/api/tasks',todoList.create_a_task);
app.get('/api/tasks/:taskId',todoList.read_a_task)
app.put('/api/tasks/:taskId',todoList.update_a_task)
app.delete('/api/tasks/:taskId',todoList.delete_a_task);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
