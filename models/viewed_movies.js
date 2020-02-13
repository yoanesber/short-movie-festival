'use strict';
module.exports = (sequelize, DataTypes) => {
  const viewed_movies = sequelize.define('viewed_movies', {
    movie_id: DataTypes.INTEGER,
    movie_title: DataTypes.STRING,
    movie_genre: DataTypes.STRING,
    viewer_id: DataTypes.INTEGER,
    viewer_username: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
  }, {});
  viewed_movies.associate = function(models) {
    // associations can be defined here
  };
  return viewed_movies;
};