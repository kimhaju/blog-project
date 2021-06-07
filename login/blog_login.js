var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyPaser = require('body-parser');
var app = express();
app.use(bodyPaser.urlencoded({ extended: false})); //->이거 빼먹고 왜 안되냐 지랄하고 있었다
app.locals.pretty = true;
app.use(session({
  secret: 'keyboardcat',
  resave: false,
  saveUninitialized: true,
  store:new MySQLStore({
    host: 'localhost',
	  port: 3306,
	  user: 'root',
	  password: '123456',
	  database: 'blog'
  })
}));
app.set('view engine', 'pug');
app.set('views', '../blog_views');
app.use(express.static('public'));
//라우트 쪽
app.get('/blog/home', function(req,res){
  res.render('join_page');
})
app.get('/blog/login', function(req,res){
  res.render('login_page');
});
app.post('/blog/login', function(req,res){
  res.send(req.body.username);
});
//포트 접속
app.listen(3000, function(){
  console.log('포트 3000 접속 완료.');
})
