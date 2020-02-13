'use strict';
module.exports = (sequelize, DataTypes) => {
  const movie_rating = sequelize.define('movie_rating', {
    movie_id: DataTypes.INTEGER,
    movie_title: DataTypes.STRING,
    movie_genre: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    voter_id: DataTypes.INTEGER,
    voter_username: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {});
  movie_rating.associate = function(models) {
    // associations can be defined here
  };
  return movie_rating;
};