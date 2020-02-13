// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;


const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/masterdata', require('./masterdata'));
router.use('/movies', require('./movies'));
router.use('/token', require('./token'));

module.exports = router;