'use strict';
var date_ob = new Date()

// adjust 0 before single digit date
var date = ("0" + date_ob.getDate()).slice(-2);

// current month
var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
var year = date_ob.getFullYear();

// current hours
var hours = date_ob.getHours();

// current minutes
var minutes = date_ob.getMinutes();

// current seconds
var seconds = date_ob.getSeconds();

// set date & time in YYYY-MM-DD HH:MM:SS format
var datetime_now = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('masterdata', [{
      propertyname : 'ACCESSGROUP',
      label : 'ADM',
      value : 'ADMIN',
      createdAt : datetime_now,
      updatedAt : datetime_now
    },{
      propertyname : 'ACCESSGROUP',
      label : 'USR',
      value : 'USER',
      createdAt : datetime_now,
      updatedAt : datetime_now
    },{
      propertyname : 'MOVIEGENRE',
      label : 'ACT',
      value : 'ACTION',
      createdAt : datetime_now,
      updatedAt : datetime_now
    },{
      propertyname : 'MOVIEGENRE',
      label : 'COM',
      value : 'COMEDY',
      createdAt : datetime_now,
      updatedAt : datetime_now
    },{
      propertyname : 'MOVIEGENRE',
      label : 'DRA',
      value : 'DRAMA',
      createdAt : datetime_now,
      updatedAt : datetime_now
    },{
      propertyname : 'MOVIEGENRE',
      label : 'HOR',
      value : 'HORROR',
      createdAt : datetime_now,
      updatedAt : datetime_now
    },{
      propertyname : 'MOVIEGENRE',
      label : 'ROM',
      value : 'ROMANCE',
      createdAt : datetime_now,
      updatedAt : datetime_now
    },{
      propertyname : 'MOVIEGENRE',
      label : 'THR',
      value : 'THRILLER',
      createdAt : datetime_now,
      updatedAt : datetime_now
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDevare('Users', null, {})
  }
};
