var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('express-flash');
var session = require('express-session');
var fs = require('fs');
var crypto = require('crypto');
var hash = crypto.createHash('sha256'); //md5

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// expose bootstrap
app.use('/scripts/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/')));
app.use('/scripts/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist/')));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
 secret: '123456cat',
 resave: false,
 saveUninitialized: true,
 cookie: { maxAge: 1800000 } // time im ms: 60000 - 1 min, 1800000 - 30min, 3600000 - 1 hour
}))

//make error and success available to every ejs template
app.use(flash());
app.use(function(req,res,next){
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success")
  next();
});


//mount routers
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// //START CRYPTO
// crypto.getHashes(); // [ 'dsa', 'dsa-sha', ..., 'md5', ... ]
// var stream = fs.createReadStream('mybigfile.dat');
// stream.on('data', function(data) {
//   hash.update(data, 'utf8')
// });
//
// stream.on('end', function() {
//   hash.digest('hex') // 34f7a3113803f8ed3b8fd7ce5656ebec
// });
//
// function checksum(str, algorithm, encoding) {
//   return crypto
//     .createHash(algorithm || 'md5')
//     .update(str, 'utf8')
//     .digest(encoding || 'hex')
// }
//
// checksum('This is my test text') // e53815e8c095e270c6560be1bb76a65d
// checksum('This is my test text', 'sha1') // cd5855be428295a3cc1793d6e80ce47562d23def
// //END CRYPTO

module.exports = app;
