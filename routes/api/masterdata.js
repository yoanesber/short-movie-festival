var express = require('express');
var router = express.Router();
var auth = require('../auth');

var model = require('../../models/index');

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

/* GET masterdata listing. */
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

    const param_propertyname = req.query.propertyname;
    const param_label = req.query.label;
    const param_value = req.query.value;

    var where_condition = {isActive:true};

    if (param_propertyname !== null && typeof param_propertyname !== 'undefined')
      where_condition.propertyname = param_propertyname;
    if (param_label !== null && typeof param_label !== 'undefined')
      where_condition.label = param_label;
    if (param_value !== null && typeof param_value !== 'undefined')
      where_condition.value = {$like:'%' + param_value + '%'};

    var masterdata = await model.masterdata.findAll({
      where:where_condition
    });

    if(masterdata.length > 0){
      res.json({
        'status':'ok',
        'message':'querying successfully',
        'data':masterdata
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

/* GET masterdata by id. */
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
    var masterdata = await model.masterdata.findOne({
      where:{
        id: param_id,
        isActive: true
      }
    });

    if(masterdata !== null){
      res.json({
        'status':'ok',
        'message':'querying successfully',
        'data':masterdata
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

/* POST masterdata. */
router.post('/', auth.required, async function(req, res, next) {
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

    var {
      propertyname,
      label,
      value
    } = req.body;
    
    var masterdata = await model.masterdata.create({
      propertyname,
      label,
      value
    });

    if(masterdata !== null){
      res.status(201).json({
        'status':'ok',
        'messages':'data successfully created',
        'data':{
          'propertyname':masterdata.propertyname,
          'label':masterdata.label,
          'value':masterdata.value,
          'createddate':masterdata.createdAt
        }
      });
    } else {
      res.status(500).json({
        'status':'error',
        'messages':'data unsuccessfully created'
      });
    }
  } catch(err){
    res.status(500).json({
      'status':'error',
      'messages':err.message
    });
  }
});

/* UPDATE masterdata. */
router.patch('/:id', auth.required, async function(req, res, next) {
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

    var {
      propertyname,
      label,
      value
    } = req.body;

    var rows_affected = await model.masterdata.update({
      propertyname,
      label,
      value
    }, {
      where: {id: param_id}
    });

    if(rows_affected > 0){
      res.json({
        'status':'ok',
        'messages':'data successfully updated',
        'data':{
          'masterdataid':param_id,
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
});

/* DELETE masterdata. */
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

    var rows_affected = await model.masterdata.destroy({
      where: {id: param_id}
    });

    if(rows_affected > 0){
      res.json({
        'status':'ok',
        'messages':'data successfully deleted',
        'data':{
          'masterdataid':param_id,
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

module.exports = router;
