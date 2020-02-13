'use strict';
module.exports = (sequelize, DataTypes) => {
  const movies = sequelize.define('movies', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    artists: DataTypes.STRING,
    genres: DataTypes.STRING,
    watchUrl: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    createdBy:DataTypes.INTEGER,
    updatedBy:DataTypes.INTEGER
  }, {});
  movies.associate = function(models) {
    // associations can be defined here
  };
  return movies;
};