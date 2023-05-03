/**
 * These routes are mostly for authentication with mongodb/sessions/Oauth,
 * We can just leave as is.
 */



const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const cookieController = require('../controllers/cookieController.js');
const sessionController = require('../controllers/sessionController.js');

//set cookie
router.get('/',cookieController.setCookie,(req,res)=> {
  res.status(200).send('cookie has been sent')
})

//signup
router.use('/signup', userController.createUser,(req,res) => {
  res.status(200).redirect('http://localhost:8080/homepage');
})

//verify user
router.use('/login',
  userController.verifyUser,
  cookieController.setSSIDCookie,
  (req,res) => {
  console.log('login')
  res.status(200).json(res.locals.user);
})

module.exports = router;