const jwt = require('express-jwt');
require('dotenv').config()
const secretkey = process.env.SECRETKEY;

const getTokenFromHeaders = (req) => {
    const { headers: { authorization } } = req;
  
    if(authorization && authorization.split(' ')[0] === 'Token') {
      return authorization.split(' ')[1];
    }

    return null;
};
  
const auth = {
    required: jwt({
        secret: secretkey,
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
    }),
    optional: jwt({
        secret: secretkey,
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        credentialsRequired: false,
    }),
};
  
module.exports = auth;