/**
 * ViewController
 *
 * @description :: Server-side logic for managing Views
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    setHomePage: function(req, res){
        Cinemagroup.find().populate('cinemas').exec(function(err, cinemagroups){
            if(err){
                res.send(500, {error: 'Database Error'});
            }

            // collect small cinema into "others" group
            var cinemas = [];
            async.each(cinemagroups, function (cinemagroup, cb) {
                if(cinemagroup.cinemas.length < 2){
                    cinemas.push(cinemagroup.cinemas[0]);
                    cinemagroups = _.filter(cinemagroups, function(item) {
                        return item.id !== cinemagroup.id;
                    });
                }
                cb();
            }, function (error) {
                if (error) return res.negotiate(error);

                cinemagroups.push(
                    {
                        cinemas: cinemas,
                        cinemaGroupName: "其他",
                        id: 0
                    }
                );

                Movie.find().exec(function(err, movies){
                    if(err){
                        res.send(500, {error: 'Database Error'});
                    }
        
                    res.view("homepage", {
                        movies: movies,
                        cinemagroups: cinemagroups
                    });
                });
            });
        });
    }
};

