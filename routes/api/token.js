var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var async = require('async');
var jwt = require('jsonwebtoken');

var model = require('../../models/index');

require('dotenv').config()
const secretkey = process.env.SECRETKEY;
const expirydayuntil = Number(process.env.EXPIRYDAYUNTIL);

var today = new Date();
today.setHours(today.getHours() + 7);
var expiryTokenDate = new Date(today);
expiryTokenDate.setDate(today.getDate() + expirydayuntil);

var generateSignedToken = function(clientId, clientSecret){
  return jwt.sign({
    clientId: clientId,
    clientSecret: clientSecret,
    exp: parseInt(expiryTokenDate.getTime() / 1000, 10),
  }, secretkey);
}

var getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req;

  if(authorization && authorization.split(' ')[0] === 'Basic') {
    return authorization.split(' ')[1];
  }

  return null;
};

var validateToken = async function(req){
  const header_token = getTokenFromHeaders(req);
  
  if(header_token === null) 
    return false;

  var s = new Buffer(header_token, 'base64');
  s = s.toString('ascii');
  s = s.split(':')

  if(s.length != 2) 
    return false;

  const param_username = s[0];
  const param_password = s[1];

  var where_condition = {isActive:true};

  if (param_username !== null && typeof param_username !== 'undefined')
    where_condition.username = param_username;

  var user = await model.users.findOne({
    attributes:['id', 'username', 'password'],
    where:where_condition
  });

  if(user ===  null)
    return false;
  
  var result = await bcrypt.compare(param_password, user.password);   
  
  if(!result)
    return false;

  return user;
};

/* GET new token. */
router.get('/', async function(req, res, next) {
  var valid_user = await validateToken(req);
  
  if(valid_user === false){
    res.status(400).json({
      'status':'error',
      'message':'user is not registered'
    });

    return
  }
  
  res.json({
    'access_token': generateSignedToken(valid_user.username, valid_user.password),
    'expires_in': expiryTokenDate
  });
});

module.exports = router;