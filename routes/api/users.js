var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var async = require('async');
var jwt = require('jsonwebtoken');
var auth = require('../auth');

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

var getAccessGroup = async function(param_username){
  var result = await model.users.findOne({
    attributes:['accessGroup'],
    where:{username: param_username}
  });

  return result.accessGroup;
}

var isAdmin = async function(username){
  var accessGroup = await getAccessGroup(username);
  return (accessGroup == 'ADM');
}

/* GET users listing. */
router.get('/', auth.required, async function(req, res, next) {
  try {
    // allowed only admin
    const { payload: { clientId } } = req;
    
    if(!await isAdmin(clientId)){
      res.status(401).json({
        'status': 'error',
        'messages': 'Unauthorized'
      });

      return
    }

    const param_username = req.query.username;
    const param_name = req.query.name;
    
    var where_condition = {isActive:true};

    if (param_username !== null && typeof param_username !== 'undefined')
      where_condition.username = param_username;
    if (param_name !== null && typeof param_name !== 'undefined')
      where_condition.name = {$like:'%' + param_name + '%'};
    
    var users = await model.users.findAll({
      where:where_condition
    });

    if(users.length > 0){
      res.json({
        'status':'ok',
        'message':'querying successfully',
        'data':users
      });
    } else {
      res.json({
        'status':'ok',
        'message':'no data returned',
        'data':null
      });
    }
  } catch(err){
    res.status(500).json({
      'status': 'error',
      'messages': err.message
    });
  }
});

/* GET user by id. */
router.get('/:id', auth.required, async function(req, res, next) {
  try {
    // allowed only admin
    const { payload: { clientId } } = req;
    
    if(!await isAdmin(clientId)){
      res.status(401).json({
        'status': 'error',
        'messages': 'Unauthorized'
      });

      return
    }

    const param_id = req.params.id;
    var user = await model.users.findOne({
      where:{
        id: param_id,
        isActive: true
      }
    });

    if(user !== null){
      res.json({
        'status':'ok',
        'message':'querying successfully',
        'data':user
      });
    } else {
      res.json({
        'status':'ok',
        'message':'no data returned',
        'data': null
      });
    }
  } catch(err){
    res.status(500).json({
      'status': 'error',
      'messages': err.message
    });
  }
});

/* REGISTER user. */
router.post('/', auth.required, async function(req, res, next) {
  // allowed only admin
  const { payload: { clientId } } = req;
  
  if(!await isAdmin(clientId)){
    res.status(401).json({
      'status': 'error',
      'messages': 'Unauthorized'
    });

    return
  }

  var {
    username,
    password,
    name,
  } = req.body;

  async.waterfall([
    function(cb){
      const saltRounds = Number(process.env.SALTROUNDS);
      bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
          if(err){
            res.status(500).json({
              'status':'error',
              'messages':err.message
            });
          }

          cb(null, hash)
        });
      });
    },
    async function(hash, cb){
      try{
        var user = await model.users.findOne({
          attributes:['id'],
          where:{username:username}
        });

        // if user is not registered yet, then create it
        if(user === null){
          var user = await model.users.create({
            username,
            password:hash,
            name
          });

          if(user !== null){
            res.status(201).json({
              'status':'ok',
              'messages':'data successfully created',
              'data':{
                'username': user.username,
                'access_token': generateSignedToken(user.username, user.password),
                'expires_in': expiryTokenDate,
                'registered_date': user.createdAt
              }
            });
          } else {
            res.status(500).json({
              'status':'error',
              'messages':'data unsuccessfully created'
            });
          }
        } else {
          res.status(400).json({
            'status':'error',
            'messages':'username already registered'
          });
        }
      } catch(err){
        res.status(500).json({
          'status':'error',
          'messages':err.message
        });
      }
    }
  ]);
});

/* UPDATE user. */
router.patch('/:id', auth.required, async function(req, res, next) {
  // allowed only admin
  const { payload: { clientId } } = req;
  
  if(!await isAdmin(clientId)){
    res.status(401).json({
      'status': 'error',
      'messages': 'Unauthorized'
    });

    return
  }

  const param_id = req.params.id;

  var {
    password,
    name
  } = req.body;

  async.waterfall([
    function(cb){
      const saltRounds = Number(process.env.SALTROUNDS);
      bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
          if(err){
            res.status(500).json({
              'status':'error',
              'messages':err.message
            });
          }

          cb(null, hash)
        });
      });
    },
    async function(hash, cb){
      try{
        var rows_affected = await model.users.update({
          password:hash,
          name
        }, {
          where: {id: param_id}
        });

        if(rows_affected > 0){
          res.json({
            'status':'ok',
            'messages':'data successfully updated',
            'data':{
              'userid':param_id,
              'updateddate':today
            }
          });
        } else {
          res.status(500).json({
            'status':'error',
            'messages':'data unsuccessfully updated'
          });
        }
      } catch(err){
        res.status(500).json({
          'status':'error',
          'messages':err.message
        });
      }
    }
  ]);
});

/* DELETE user. */
router.delete('/:id', auth.required, async function(req, res, next) {
  try{
    // allowed only admin
    const { payload: { clientId } } = req;
    
    if(!await isAdmin(clientId)){
      res.status(401).json({
        'status': 'error',
        'messages': 'Unauthorized'
      });

      return
    }
    
    const param_id = req.params.id;

    var rows_affected = await model.users.destroy({
      where: {id: param_id}
    });

    if(rows_affected > 0){
      res.json({
        'status':'ok',
        'messages':'data successfully deleted',
        'data':{
          'userid':param_id,
          'deleteddate': today
        }
      });
    } else {
      res.status(500).json({
        'status':'error',
        'messages':'data unsuccessfully deleted'
      });
    }
  } catch(err){
    res.status(500).json({
      'status':'error',
      'messages':err.message
    });
  }
});

/* LOGIN. */
router.patch('/act/login', function(req, res, next) {
  const param_username = req.body.username;
  const param_password = req.body.password;

  async.waterfall([
    function(cb){
      // get user based on username
      var where_condition = {isActive:true};
  
      if (param_username !== null && typeof param_username !== 'undefined')
        where_condition.username = param_username;
  
      model.users.findOne({
        attributes:['id', 'username', 'password'],
        where:where_condition
      }).then(function(user){
        if(user !== null){
          cb(null, user);
        } else {
          cb(null, null);
        }
      });
    }, 
    function(user, cb){
      if(user === null){
        res.status(400).json({
          'status':'error',
          'message':'user is not registered'
        });
      }

      // compare inputted password with bcrypted password that is stored in db 
      bcrypt.compare(param_password, user.password, function(err, result) {
          if(err){
            cb(null, null, null);
          }
          else cb(null, user, result);
      });   
    },
    async function(user, ismatch, cb){
      if(ismatch !== true){
        res.status(400).json({
          'status':'error',
          'message':'password is not valid'
        });
      } else {
        var rows_affected = await model.users.update({
          isLogin:true
        }, {
          where: {id: user.id}
        });
        
        if(rows_affected > 0){
          res.json({
            'status':'ok',
            'message':'login successfully',
            'data':{
              'username':param_username,
              'access_token': generateSignedToken(param_username, param_password),
              'expires_in': expiryTokenDate,
              'logindate':today
            }
          });
        } else{
          res.status(500).json({
            'status':'error',
            'message':'login unsuccessful'
          });
        }
      }
    }
  ]);
});

/* LOGOUT. */
router.patch('/act/logout', auth.required, async function(req, res, next) {
  const { payload: { clientId } } = req;

  const param_username = clientId;
  
  var rows_affected = await model.users.update({
    isLogin:false
  }, {
    where: {username: param_username}
  });
  
  if(rows_affected > 0){
    res.json({
      'status':'ok',
      'message':'logout successfully',
      'data':{
        'username':param_username,
        'logoutdate':today
      }
    });
  } else{
    res.status(500).json({
      'status':'error',
      'message':'logout unsuccessful'
    });
  }

});

module.exports = router;