var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyPaser = require('body-parser');
var bkfd2Password = require("pbkdf2-password");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var hasher = bkfd2Password();
var mysql = require('mysql');
var conn = mysql.createConnection({
  host : 'localhost',
  user : '아이디 가림처리',
  password : '패스워드가림처리',
  database : '데이터 베이스가림처리 '
});
conn.connect();
var app = express();
app.use(bodyPaser.urlencoded({ extended: false}));
app.locals.pretty = true;
app.use(session({
  secret: 'keyboardcat',
  resave: false,
  saveUninitialized: true,
  store:new MySQLStore({
    host: 'localhost',
	  port: 3306,
	  user: '아이디 가림처리',
	  password: '비번 가림처리 ',
	  database: '데이터 베이스 가림처리'
  })
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'pug');
app.set('views', '../blog_views');
app.use(express.static('public'));
//라우트 쪽
app.get('/blog/home', function(req,res){
    res.render('top_layout', {user:req.user});
});
app.get('/blog/join', function(req,res){
  res.render('join_page');
})
app.post('/blog/join', function(req,res){
  hasher({password:req.body.password}, function(err, pass, salt, hash){
    var user = {
      authId:'local: '+req.body.username,
      username:req.body.username,
      user_nickname : req.body.user_nickname,
      password:hash,
      email: req.body.email,
      salt:salt
    };
    var sql = 'INSERT INTO users set ?';
    conn.query(sql, user, function(err, results){
      if(err){
        console.log('회원가입 실패.'+err);
        res.status(500);
      }else {
        req.login(user, function(err){
          req.session.save(function(){
            res.redirect('/blog/home');
          });
        });
      }
    });
  });
});
passport.serializeUser(function(user, done){
  console.log('serializeUser', user);
  done(null, user.authId);
});
passport.deserializeUser(function(id, done){
  console.log('deserializeUser', id);
  var sql = 'SELECT * FROM users WHERE authId=?';
  conn.query(sql, [id], function(err, results){
    if(err){
      console.log(err);
      done('유저가 현재 없습니다.');
    }else {
      done(null, results[0]);
    }
  })
});
passport.use(new LocalStrategy(
  function(username, password, done){
    var uname = username;
    var pwd = password;
    var sql = 'SELECT * FROM users WHERE authId = ?';
    conn.query(sql, ['local: '+uname], function(err, results){
      if(err){
        return done('There is no user.');
      }
      var user = results[0];
      return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
        if(hash === user.password){
          console.log('LocalStrategy: 로그인시 유저값', user);
          done(null, user);
        } else {
          done(null, false);
        }
      });
    });
  }
));
app.post('/blog/login',passport.authenticate(
  'local',
  { successRedirect: '/blog/home',
    failureRedirect: '/blog/login',
    failureFlash: false }
  )
);
app.get('/blog/login', function(req,res){
  res.render('login_page');
});
app.get('/blog/logout', function(req,res){
  req.logout();
  req.session.save(function(){
    res.redirect('/blog/home');
  });
});

app.get('/blog/add.write', function(req,res){
  res.render('add_write', {user:req.user});
  console.log('아이디값 추가 확인: '+req.user.authId);
});
/*
app.post('/blog/add.write', function(req,res){
  var userPosting ={
    title: req.body.title,
    post
  }
  var sql = 'INSERT INTO posting set=?'
  conn.query(sql, userPosting, function(err, rows, fields){
    if(err){
      console.log('값을 추가 하지 못했습니다.:'+err);
    }
  })
});
*/
app.get('/blog/list', function(req,res){
  var sql = 'SELECT post_number, title, postname FROM posting';
  conn.query(sql, function(err, list, fields){
    res.render('top_layout', {list:list});
  });
});


//포트 접속
app.listen(3000, function(){
  console.log('포트 3000 접속 완료.');
})
