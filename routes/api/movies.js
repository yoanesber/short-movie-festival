var express = require('express');
var router = express.Router();
var auth = require('../auth');

var model = require('../../models/index');

var today = new Date();
today.setHours(today.getHours() + 7);

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

var isUser = async function(username){
  var accessGroup = await getAccessGroup(username);
  return (accessGroup == 'USR');
}

/* GET movies listing. */
router.get('/', auth.required, async function(req, res, next) {
  try {
    const param_title = req.query.title;
    const param_description = req.query.description;
    const param_artists = req.query.artists;
    const param_genres = req.query.genres;
    var param_rowlimit = parseInt(req.query.l);
    var param_currpage = parseInt(req.query.p);

    var where_condition = {isActive:true};
    
    if (param_title !== null && typeof param_title !== 'undefined')
      where_condition.title = {$like:'%' + param_title + '%'};
    if (param_description !== null && typeof param_description !== 'undefined')
      where_condition.description = {$like:'%' + param_description + '%'};
    if (param_artists !== null && typeof param_artists !== 'undefined')
      where_condition.artists = {$like:'%' + param_artists + '%'};
    if (param_genres !== null && typeof param_genres !== 'undefined')
      where_condition.genres = param_genres;

    if(!param_rowlimit || param_rowlimit === null || typeof param_rowlimit === 'undefined')
      param_rowlimit = 100;
    if(!param_currpage || param_currpage === null || typeof param_currpage === 'undefined')
      param_currpage = 1;

    var offset = (param_currpage > 1)?parseInt((param_currpage * param_rowlimit) - param_rowlimit):0;

    var movies = await model.movies.findAll({
      where:where_condition,
      limit:param_rowlimit,
      offset:offset
    });

    if(movies.length > 0){
      res.json({
        'status':'ok',
        'message':'querying successfully',
        'data':movies
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

/* GET movie by id. */
router.get('/:id', auth.required, async function(req, res, next) {
  try {
    const param_id = req.params.id;

    var movie = await model.movies.findOne({
      where:{
        id: param_id,
        isActive: true
      }
    });

    if(movie !== null){
      res.json({
        'status':'ok',
        'message':'querying successfully',
        'data':movie
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

/* VIEW movie. */
router.post('/act/viewed/:id', auth.required, async function(req, res, next) {
  try {
    // allowed only user
    const { payload: { clientId } } = req;
    
    if(!await isUser(clientId)){
      res.status(401).json({
        'status': 'error',
        'messages': 'Unauthorized'
      });

      return
    }

    const param_id = req.params.id;
    const param_uname = req.query.u;

    var movie = await model.movies.findOne({
      where:{
        id: param_id,
        isActive: true
      }
    });

    if(movie !== null){
      // check the validity of user data based on username
      var user = await model.users.findOne({
        attributes:['id', 'username'],
        where:{
          username:param_uname,
          isActive: true
        }
      });

      if(user !== null){
        // check if the user has viewed/downloaded the movie
        var result = await model.viewed_movies.findOne({
          where:{
            viewer_id: user.id,
            movie_id: movie.id
          }
        }); 

        // if the user has't viewed/downloaded the movie, then insert
        if(result === null){
          var viewed_movie = await model.viewed_movies.create({
            movie_id: movie.id,
            movie_title: movie.title,
            movie_genre: movie.genres,
            viewer_id: user.id,
            viewer_username: user.username
          });

          if(viewed_movie !== null){
            res.json({
              'status':'ok',
              'message':'data successfully created',
              'data':{
                'movietitle': viewed_movie.movie_title,
                'moviegenre': viewed_movie.movie_genre,
                'viewerusername': viewed_movie.viewer_username,
                'viewdate': viewed_movie.createdAt
              }
            });  
          } else {
            res.status(500).json({
              'status':'error',
              'messages':'data unsuccessfully created'
            });
          }
        } else {
          res.json({
            'status':'ok',
            'message':'user has already downloaded/viewed it before',
            'data':{
              'movietitle': result.movie_title,
              'moviegenre': result.movie_genre,
              'viewerusername': result.viewer_username,
              'viewdate': result.createdAt
            }
          });  
        }
      } else {
        res.status(400).json({
          'status':'error',
          'message':'user is not registered'
        });
      }
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

/* VOTE movie. */
router.post('/act/vote/:id', auth.required, async function(req, res, next) {
  try {
    // allowed only user
    const { payload: { clientId } } = req;
    
    if(!await isUser(clientId)){
      res.status(401).json({
        'status': 'error',
        'messages': 'Unauthorized'
      });

      return
    }

    const param_id = req.params.id;
    const param_rating = req.query.r;
    const param_uname = clientId;

    var movie = await model.movies.findOne({
      where:{
        id: param_id,
        isActive: true
      }
    });

    if(movie !== null){
      // check the validity of user data based on username
      var user = await model.users.findOne({
        attributes:['id', 'username'],
        where:{
          username:param_uname,
          isActive: true
        }
      });

      if(user !== null){
        // check if the user already gave the rating to a movie
        var result = await model.movie_rating.findOne({
          where:{
            voter_id: user.id,
            movie_id: movie.id
          }
        }); 

        // if the user has't gave the rating to a movie, then insert
        if(result === null){
          var rating = (Number(param_rating) > 5)?5:Number(param_rating);

          console.log(rating);

          var movie_rating = await model.movie_rating.create({
            movie_id: movie.id,
            movie_title: movie.title,
            movie_genre: movie.genres,
            rating: rating,
            voter_id: user.id,
            voter_username: user.username
          });

          if(movie_rating !== null){
            res.json({
              'status':'ok',
              'message':'movie successfully voted',
              'data':{
                'movietitle': movie_rating.movie_title,
                'moviegenre': movie_rating.movie_genre,
                'rating': movie_rating.rating,
                'voterusername': movie_rating.voter_username,
                'votedate': movie_rating.createdAt
              }
            });  
          } else {
            res.status(500).json({
              'status':'error',
              'messages':'movie unsuccessfully unvoted'
            });
          }
        } else {
          res.json({
            'status':'ok',
            'message':'user has already voted it before',
            'data':{
              'movietitle': result.movie_title,
              'moviegenre': result.movie_genre,
              'rating': result.rating,
              'voterusername': result.voter_username,
              'votedate': result.createdAt
            }
          });  
        }
      } else {
        res.status(400).json({
          'status':'error',
          'message':'user is not registered'
        });
      }
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

/* UNVOTE movie. */
router.patch('/act/unvote/:id', auth.required, async function(req, res, next) {
  try{
    // allowed only user
    const { payload: { clientId } } = req;
    
    if(!await isUser(clientId)){
      res.status(401).json({
        'status': 'error',
        'messages': 'Unauthorized'
      });

      return
    }

    const param_movie_id = req.params.id;
    const param_voter_username = clientId;

    var rows_affected = await model.movie_rating.update({
      status: false
    }, {
      where: {
        movie_id: param_movie_id,
        voter_username: param_voter_username
      }
    });

    if(rows_affected > 0){
      res.json({
        'status':'ok',
        'messages':'movie successfully unvoted',
        'data':{
          'movie_id': param_movie_id,
          'voter_username': param_voter_username,
          'unvotedate':today
        }
      });
    } else {
      res.status(500).json({
        'status':'error',
        'messages':'movie unsuccessfully unvoted'
      });
    }
  } catch(err){
    res.status(500).json({
      'status':'error',
      'messages':err.message
    });
  }
});

/* GET most viewed movie. */
router.get('/mostviewed/all', auth.required, async function(req, res, next) {
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

    var where_condition = {status:true};

    var viewed_movie = await model.viewed_movies.findAll({
      where:where_condition
    });

    if(viewed_movie.length > 0){
      var distinct_viewed_movie_id = [...new Set(viewed_movie.map(item => item.movie_id))];
      var viewed_movie_by_id = distinct_viewed_movie_id.map(function(movie_id){
        var v = viewed_movie.filter(function(item){
          return item.movie_id == movie_id
        });

        return {
          'movie_title': v[0].movie_title,
          'movie_genre': v[0].movie_genre,
          'number_of_viewers': v.length,
          'viewers': v.map(function(item){
            return {
              'viewer_username': item.viewer_username,
              'view_date': item.createdAt,
            }
          })
        };
      });

      // sort by number_of_viewer
      viewed_movie_by_id.sort(function(a, b){
        if(a.number_of_viewer < b.number_of_viewer) return 1;
        if(a.number_of_viewer > b.number_of_viewer) return -1;
        return 0
      });

      var results = {
        'number_of_movies':distinct_viewed_movie_id.length,
        'records': viewed_movie_by_id
      };

      res.json({
        'status':'ok',
        'message':'querying successfully',
        'data':results
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

/* GET most viewed genre. */
router.get('/mostviewed/by/genre/:genre', auth.required, async function(req, res, next) {
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

    const param_genre = req.params.genre;
    var where_condition = {status:true};

    if (param_genre !== null && typeof param_genre !== 'undefined')
      where_condition.movie_genre = param_genre;
    
    var viewed_movies_by_genre = await model.viewed_movies.findAll({
      where:where_condition
    });
    
    if(viewed_movies_by_genre.length > 0){
      var distinct_viewed_movie_id = [...new Set(viewed_movies_by_genre.map(item => item.movie_id))];
      var viewed_movie_by_id = distinct_viewed_movie_id.map(function(movie_id){
        var v = viewed_movies_by_genre.filter(function(item){
          return item.movie_id == movie_id
        });

        return {
          'movie_title': v[0].movie_title,
          'movie_genre': v[0].movie_genre,
          'number_of_viewers': v.length,
          'viewers': v.map(function(item){
            return {
              'viewer_username': item.viewer_username,
              'view_date': item.createdAt,
            }
          })
        };
      });

      // sort by number_of_viewer
      viewed_movie_by_id.sort(function(a, b){
        if(a.number_of_viewer < b.number_of_viewer) return 1;
        if(a.number_of_viewer > b.number_of_viewer) return -1;
        return 0
      });

      var results = {
        'number_of_movies':distinct_viewed_movie_id.length,
        'records': viewed_movie_by_id
      };
      
      res.json({
        'status':'ok',
        'message':'querying successfully',
        'data':results
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

/* GET list all of the user's voted movie. */
router.get('/voted/all', auth.required, async function(req, res, next) {
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

    var voted_movies = await model.movie_rating.findAll({
      where:{status:true}
    });
    
    if(voted_movies.length > 0){
      var distinct_voted_movie_id = [...new Set(voted_movies.map(item => item.movie_id))];
      var voted_movies_by_id = distinct_voted_movie_id.map(function(movie_id){
        var v = voted_movies.filter(function(item){
          return item.movie_id == movie_id
        });

        return {
          'movie_title': v[0].movie_title,
          'movie_genre': v[0].movie_genre,
          'avg_rating': parseFloat(v.reduce(function(tot, curr){return tot + curr.rating;}, 0)/v.length).toFixed(2),
          'number_of_voters': v.length,
          'voters': v.map(function(item){
            return {
              'voter_username': item.voter_username,
              'rating': item.rating
            }
          })
        }
      });

      // sort by avg_rating
      voted_movies_by_id.sort(function(a, b){
        if(a.avg_rating < b.avg_rating) return 1;
        if(a.avg_rating > b.avg_rating) return -1;
        return 0
      });

      var results = {
        'number_of_movies':distinct_voted_movie_id.length,
        'records': voted_movies_by_id
      };
      
      res.json({
        'status':'ok',
        'message':'querying successfully',
        'data':results
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

/* POST movie. */
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

    const {
      title,
      description,
      artists,
      genres,
      watchUrl,
      createdBy
    } = req.body;
    
    var movie = await model.movies.create({
      title,
      description,
      artists,
      genres,
      watchUrl,
      createdBy
    });

    if(movie !== null){
      res.status(201).json({
        'status':'ok',
        'messages':'data successfully created',
        'data':movie
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

/* UPDATE movie. */
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
      title,
      description,
      artists,
      genres,
      watchUrl,
      updatedBy
    } = req.body;

    var rows_affected = await model.movies.update({
      title,
      description,
      artists,
      genres,
      watchUrl,
      updatedBy
    }, {
      where: {id: param_id}
    });

    if(rows_affected > 0){
      res.json({
        'status':'ok',
        'messages':'data successfully updated',
        'data':{
          'movieid':param_id,
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

/* DELETE movie. */
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

    const rows_affected = await model.movies.destroy({
      where: {id: param_id}
    });

    if(rows_affected > 0){
      res.json({
        'status':'ok',
        'messages':'data successfully deleted',
        'data':{
          'movieid':param_id,
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
