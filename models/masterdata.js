'use strict';
module.exports = (sequelize, DataTypes) => {
  const masterdata = sequelize.define('masterdata', {
    propertyname: DataTypes.STRING,
    label: DataTypes.STRING,
    value: DataTypes.STRING
  }, {});
  masterdata.associate = function(models) {
    // associations can be defined here
  };
  return masterdata;
};