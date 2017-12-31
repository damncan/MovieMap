/**
 * MovieController
 *
 * @description :: Server-side logic for managing Movies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getAllMovies: function(req, res){
        Movie.find().exec(function(err, movie){
            if(err){
                res.send(500, {error: 'Database Error'});
            }
            res.send(movie);
        });
    },
};

