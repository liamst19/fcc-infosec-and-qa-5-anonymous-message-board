/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect     = require('chai').expect;

// Data Models
const Thread   = require('../models/thread');
const Reply    = require('../models/reply');

module.exports = function (app) {
  
  app.route('/api/threads/:board');
    
  app.route('/api/replies/:board');

};
