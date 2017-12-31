/**
 * CinemaController
 *
 * @description :: Server-side logic for managing cinemas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    getAllCinema: function(req, res){
        Cinema.find().populate(["cinemagroupModel"]).exec(function(err, cinema){
            if(err){
                res.send(500, {error: 'Database Error'});
            }
            res.send(cinema);
        });
    },
};

