/**
 * ShowtimeController
 *
 * @description :: Server-side logic for managing Showtimes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var _ = require('underscore');
var async = require('async');

module.exports = {
    getFullShowtimes: function (req, res) {
        Showtime.find({
            where: {
                movieModel: [1, 2], cinemaModel: [1],
            },
        })
        .populate(["movieModel", "cinemaModel"])
        .exec(function (err, showtimes) {
            async.each(showtimes, function (showtime, cb) {
                Cinemagroup.findOne(showtime.cinemaModel.cinemagroupModel)
                    .then(function (cinemagroup) {
                        showtime.cinemaModel.cinemagroupModel = cinemagroup;
                        cb();
                    })
                    .fail(function (error) {
                        cb(error);
                    })
            }, function (error) {
                if (error) return res.negotiate(error);

                return res.json(showtimes);
            });
        });
    },

    getCinemasBySearch: function (req, res) {
        var date = new Date(req.query.datetime);
        date = date.setDate(27);

        var movieModel = req.query.selectedMovie.split(",");
        var cinemaModel = req.query.selectedCinema.split(",");

        // var movieModel = [1, 2, 3];
        // var cinemaModel = [1, 2];

        // var date = new Date('12/27/2017 2:00 PM').getTime();
        var dateLower = new Date(date + (6 * 60 * 60 * 1000));
        var dateUpper = new Date(date + (10 * 60 * 60 * 1000));
        // var dateLower = new Date(date - (2 * 60 * 60 * 1000));
        // var dateUpper = new Date(date + (2 * 60 * 60 * 1000));

        Showtime.find({
            where: {
                movieModel: movieModel, cinemaModel: cinemaModel,
                showtime: { '>': dateLower, '<': dateUpper }
            },
        })
        .populate(["movieModel", "cinemaModel"])
        .exec(function (err, showtime) {
            var result = _.pluck(showtime, "cinemaModel");
            result = _.map(_.groupBy(result, function (doc) {
                return doc.id;
            }), function (grouped) {
                return grouped[0];
            });

            if (err) {
                res.send(500, { error: 'Database Error' });
            }

            res.send(result);
        });
    },

    getShowtimesByCinema: function (req, res) {
        var date = new Date(req.query.datetime);
        date = date.setDate(27);

        var movieModel = req.query.selectedMovie.split(",");
        var cinemaModel = req.query.selectedCinema;

        // var movieModel = [1, 2, 3];
        // var cinemaModel = [1];

        // var date = new Date('12/27/2017 2:00 PM').getTime();
        var dateLower = new Date(date + (6 * 60 * 60 * 1000));
        var dateUpper = new Date(date + (10 * 60 * 60 * 1000));
        // var dateLower = new Date(date - (2 * 60 * 60 * 1000));
        // var dateUpper = new Date(date + (2 * 60 * 60 * 1000));

        Showtime.find({
            where: {
                movieModel: movieModel, cinemaModel: cinemaModel,
                showtime: { '>': dateLower, '<': dateUpper }
            },
        })
        .populate(["movieModel", "cinemaModel"])
        .then(function (showtime) {
            var result = _.groupBy(showtime, function (currentObject) {
                return currentObject.movieModel.movieName
            });

            Cinemagroup.findOne({
                id: showtime[0].cinemaModel.cinemagroupModel
            })
                .populate(["marketings"])
                .then(function (cinemagroup) {
                    res.send({ showtime: result, marketing: cinemagroup.marketings });
                })
                .catch(function (err) {
                    res.send(500, { error: 'Database Error' });
                });
        })
        .catch(function (err) {
            res.send(500, { error: 'Database Error' });
        });
    },
};