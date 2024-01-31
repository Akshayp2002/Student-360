var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars')
var db = require('./config/connection')
var favicon = require('serve-favicon')



    



var adminRouter = require('./routes/admin');

var session = require('express-session'); 
const nttfhelper = require('./helper/nttfhelper');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use('/public/stylesheets', express.static(path.join(__dirname, '/public/stylesheets')));
app.use('/public/javascripts', express.static(path.join(__dirname,'/public/javascripts/')))


app.use(session({secret:'key',cookie:{maxAge:3600000}}))

db.connect((err)=>{
  if(err) console.log('not connected');
  else console.log('connected to port 27017');
})


app.use('/', adminRouter);




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

module.exports = app;