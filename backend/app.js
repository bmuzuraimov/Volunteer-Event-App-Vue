// Import required modules
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
require('./config/passport')(passport); // Passport configuration
require('dotenv').config();

// Import routes
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin.js');
var volunteerRouter = require('./routes/volunteer.js');

// Initialize Express app
var app = express();

// JSON formatting setup for better readability in responses
app.set('json spaces', 2);

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', indexRouter);
app.use('/api/admin', passport.authenticate('bearer', { session: false }), adminRouter);
app.use('/api/volunteer', passport.authenticate('bearer', { session: false }), volunteerRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Send the error response
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status
    }
  });
});

module.exports = app;