const path = require('path');
require('dotenv').config();
const express = require('express');
const mongoose = require ('mongoose');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

// Require in any controllers
const oaRouter = require('./routes/oaRouter.js');

// Parse JSON and urlencoded in requests; parse cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // “extended” allows for rich objects and arrays to be encoded into the URL-encoded format
app.use(cookieParser());


// Routing for local webpack bundles
app.use('/build', express.static(path.join(__dirname, '../build')));

// Routing for oauth endpoint
app.use('/oauth', oaRouter);

// Route for serving index.html at root endpoint
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
