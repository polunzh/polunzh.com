const path = require('path');

const config = require('config');
const express = require('express');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const hbs = require('hbs');

const setupLogger = require('./libs/logger');
const util = require('./util');
const index = require('./routes/index');
const github = require('./routes/github');

const app = express();
app.locals.year = new Date().getFullYear();
// <handlebars>
util.registerHandlebarsHelper(hbs);
hbs.registerPartials(`${__dirname}/views/partials`);
// </ handlebars>

setupLogger(app);
github.initData();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/lib', express.static(path.join(__dirname, '..', 'node_modules')));

app.use('/', index);
app.use('/api', github.router);

app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  return res.status(404).render('404');
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
