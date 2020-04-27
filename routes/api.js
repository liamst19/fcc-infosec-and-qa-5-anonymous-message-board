/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
// Mongoose
var mongoose = require("mongoose");
const Schema = mongoose.Schema;


module.exports = function (app) {
  mongoose.set("useFindAndModify", false);
  mongoose.connect(process.env.DB);
  
  app.route('/api/threads/:board');
    
  app.route('/api/replies/:board');

};
