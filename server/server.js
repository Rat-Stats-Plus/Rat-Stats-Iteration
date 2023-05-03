const path = require('path');
require('dotenv').config();
const express = require('express');
const mongoose = require ('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

const sqlRouter = require('./routes/sqlRouter.js');
const oaRouter = require('./routes/oaRouter.js');
const userRouter = require('./routes/userRouter.js');
const prismaRouter = require('./routes/prismaRouter.js');
mongoose.connect(process.env.MDB_URI);
const PG_URI = "postgres://btfrbjza:NjO66Fz-C5GHsPIWsodm5Z6dd7GtPV7n@lallah.db.elephantsql.com/btfrbjza"

const PORT = 3000;

// Parse incoming data in request body or cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // “extended” allows for rich objects and arrays to be encoded into the URL-encoded format
app.use(bodyParser.json({ type: '*/*' }));
app.use(cookieParser());

// Routing for oauth endpoint
app.use('/oauth', oaRouter, (req,res) => {
  console.log(req.body)
});

// Routing for sql endpoint to query users,rats,sighting tables
app.use('/sql', prismaRouter);

// Routing for user login and register
app.use('/user', userRouter);

// Routes for serving static files in production mode
/*
  The following can be toggled off in development mode, since devServer automatically 
  serves transpiled files from memory for the '/' endpoint. 
  
  Catchall static routing for '/' (i.e. 'app.use(express.static(...))') seems to break 
  React Router routing. Haven't found solution other than hardcoding endpoints for 
  individual build files. Even with 'historyApiFallback: true' AND hardcoded proxy endpoints 
  inside 'webpack.config.js', 'app.use(express.static(...))' will try to route requests 
  for ALL routes, including React Router routes. Express server and React Router endpoints
  must not overlap, or the former will break the latter.
*/



app.use('/bundle.js', (req, res) => {
  console.log('Serving bundle.js');
  res.status(200).sendFile(path.join(__dirname, '../build/bundle.js'));
})

app.use('/styles.css', (req, res) => {
  console.log('Serving styles.css');
  res.status(200).sendFile(path.join(__dirname, '../build/styles.css'));
})

app.use('/', (req, res) => {
  console.log('Serving index.html');
  res.status(200).sendFile(path.join(__dirname, '../build/index.html'));
})


// Global error handling
////// Create default error object
const defaultErr = {
  log: 'A middleware error occured.',
  status: 400,
  message: 'Invalid client request.'
}
////// Global error handler
app.use((err, req, res, next) => {
  // Create error object based on err
  const errorObj = Object.assign({}, defaultErr, err);
  // Log error to terminal
  console.log(errorObj.log);
  // Send error message to client
  res.status(errorObj.status).json(errorObj.message);
});

// Start server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
})