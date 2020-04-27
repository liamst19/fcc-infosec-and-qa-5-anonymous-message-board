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
  
  app.route('/api/threads/:board')
     .get(async (request, response, next) => {
        
      })
  
     .post(async (request, response, next) => {
        const body = request.body;

        try{
          const newThread = new Thread({
            title:            body.title,
            text:             body.text,
            delete_password:  body.delete_password,
            created_on:       new Date(),
            bumped_on:        new Date()
          });
          const savedThread = await newThread.save();
          response.status(201).json(savedThread);
        } catch (e){
          console.log('ERROR /api/threads/:board', e)
          next(e)
        }
      })
  
     .put(async (request, response, next) => { 
    
      })
  
     .delete(async (request, response, next) => { 
    
      })
    
  app.route('/api/replies/:board')
     .get(async (request, response, next) => {
        
      })
  
     .post(async (request, response, next) => {
        const body = request.body;

        try{
          const newReply = new Reply({
            threadId:         body.threadid,
            created_on:       new Date(),
            text:             body.text,
            delete_password:  body.delete_password
          });
          //const savedReply = await newReply.save();
          //response.status(201).json(savedReply);
        } catch (e){
          console.log('ERROR /api/threads/:board', e)
          next(e)
        }
      })
  
     .put(async (request, response, next) => { 
    
      })
  
     .delete(async (request, response, next) => { 
    
      })

};
