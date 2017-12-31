/**
 * Cinemagroup.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    cinemaGroupName:{
      type: 'string'
    },
    cinemas:{
        collection: 'cinema',
        via: 'cinemagroupModel'
    },
    marketings:{
        collection: 'marketing',
        via: 'cinemagroupModel'
    },
  }
};

