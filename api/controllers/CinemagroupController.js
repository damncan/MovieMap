/**
 * CinemagroupController
 *
 * @description :: Server-side logic for managing cinemagroups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var _ = require('underscore');
var async = require('async');

module.exports = {
    getAllCinemaGroups: function(req, res){
        Cinemagroup.find().populate(['cinemas','marketings']).exec(function(err, cinemagroups){
            if(err){
                res.send(500, {error: 'Database Error'});
            }

            console.log(cinemagroups);

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

                return res.json(cinemagroups);
            });
        });
    },
};

