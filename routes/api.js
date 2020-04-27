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
  
  // ----------------------------------------------------------
  // Threads
  
  app.route('/api/threads/:board')
  /* 6. GET Thread
       I can GET an array of the most recent 10 bumped 
       threads on the board with only the most recent 
       3 replies from /api/threads/{board}. The reported
       and delete_passwords fields will not be sent.
  */
     .get(async (request, response, next) => {
        const threadLimit = 10;
        const replyLimit = 3;
    
        const board = request.params.board;
        if(!board) return response.status(400).send('no board specified')
    
        try{
          const threads = await Thread
                  .find({ board }, '-delete_password -reported' ,{ replies: { $slice: -1 * replyLimit }})
                  .sort({ bumped_on: -1 })
                  .limit(threadLimit)
                  .populate({path: 'replies', select: '-delete_password -reported'});
          
          console.log('threads', threads)
          response.json(threads);
        } catch(e){
          console.log('ERROR GET /api/threads/:board', e)
          next(e)          
        }
      })
  
  /* 4. POST Thread 
        I can POST a thread to a specific message board by 
        passing form data text and delete_password to 
        /api/threads/{board}.(Recomend res.redirect to board 
        page /b/{board}) Saved will be _id, text, 
        created_on(date&time), bumped_on(date&time, starts 
        same as created_on), reported(boolean), delete_password, 
        & replies(array).
  */
     .post(async (request, response, next) => {
    
        const board = request.params.board;
        if(!board) return response.status(400).send('no board specified')
    
        const body = request.body;

        try{
          const newThread = new Thread({
            board:            board,
            title:            body.title,
            text:             body.text,
            delete_password:  body.delete_password, // hash?
            created_on:       new Date(),
            bumped_on:        new Date()
          });
          const savedThread = await newThread.save();
          
          console.log('thread posted', savedThread)
          response.status(201).json(savedThread);
        } catch (e){
          console.log('ERROR POST /api/threads/:board', e)
          next(e)
        }
      })
  
  /* 10. PUT Thread 
       I can report a thread and change it's reported value to true
       by sending a PUT request to /api/threads/{board} and pass 
       along the thread_id. (Text response will be 'success')
  */
     .put(async (request, response, next) => {
    
        const thread_id = request.body.thread_id;
        if(!thread_id) return response.status(400).send('no thread id');
    
        try{
          const updatedThread = await Thread.findByIdAndUpdate(thread_id, { reported: true });
          
          if(!updatedThread){
            return response.status(200).send('success');
          } else{
            return response.status(400).send('no thread found for id')
          }          
        } catch(e){
          console.log('ERROR PUT /api/threads/:board', e)
          next(e)          
        }
      })
  
  /* 8. DELETE Thread
       I can delete a thread completely if I send a DELETE request 
       to /api/threads/{board} and pass along the thread_id &
       delete_password. (Text response will be 'incorrect password' 
       or 'success')
  */
     .delete(async (request, response, next) => {
    
        const thread_id = request.body.thread_id;
        if(!thread_id) return response.status(400).send('no thread id');
    
        try{
          
          const thread = await Thread.findById(thread_id)
          if(!thread) return response.status(400).send('no thread found for id')
          
          await thread.remove();
          
          await Reply.deleteMany({ thread_id });
          
          response.status(204).end();
        } catch(e){
          console.log('ERROR DELETE /api/threads/:board', e)
          next(e)          
        }
      })
  
  // ----------------------------------------------------------
  // ----------------------------------------------------------
  // Replies
  
  app.route('/api/replies/:board')
  /* 7. GET Replies
       I can GET an entire thread with all it's replies from
       /api/replies/{board}?thread_id={thread_id}. Also hiding
       the same fields.
  */
     .get(async (request, response, next) => {
    
        const board = request.params.board;
        const thread_id = request.query.thread_id;
    
        if(!board) return response.status(400).send('no board specified')
        else if(!thread_id) return response.status(400).send('no thread id');
    
        try{
          
          const thread = await Thread
                            .findById(thread_id, '-delete_password -reported')
                            .populate({
                                path: 'replies', 
                                select: '-delete_password -reported'
                              });
          if(!thread) return response.status(400).send('no thread found for id')
          
          return response.json(thread)
        } catch(e){
          console.log('ERROR GET /api/replies/:board', e)
          next(e)          
        }
      })
  
  /* 5. POST Reply
       I can POST a reply to a thead on a specific board by passing 
       form data text, delete_password, & thread_id to 
       /api/replies/{board} and it will also update the bumped_on 
       date to the comments date.(Recomend res.redirect to thread 
       page /b/{board}/{thread_id}) In the thread's 'replies' array 
       will be saved _id, text, created_on, delete_password, & 
       reported.
  */
     .post(async (request, response, next) => {
    
        const board = request.params.board;
        const thread_id = request.body.thread_id;
    
        if(!board) return response.status(400).send('no board specified')
        else if(!thread_id) return response.status(400).send('no thread id');
    
        const body = request.body;

        try{
          
          const thread = await Thread.findById(thread_id);
          if(!thread) return response.status(400).send('no thread found for id');
          console.log('thread for reply', thread)
          const newReply = new Reply({
            thread_id:        body.thread_id,
            created_on:       new Date(),
            text:             body.text,
            delete_password:  body.delete_password // hash?
          });
          const savedReply = await newReply.save();
          
          const threadUpdateData = {
            bumped_on: new Date(),
            replies: [...thread.replies, savedReply._id]
          };
          const updatedThread = await Thread.findByIdAndUpdate(thread_id, threadUpdateData, { new: true })
          
          response.redirect(`/b/${board}/${thread_id}`);
          
        } catch (e){
          console.log('ERROR /api/threads/:board', e)
          next(e)
        }
      })
  
  /* 11. PUT Reply
      I can report a reply and change it's reported value to true by 
      sending a PUT request to /api/replies/{board} and pass along the
      thread_id & reply_id. (Text response will be 'success')
  */
     .put(async (request, response, next) => {
    
        const board = request.params.board;
        const reply_id = request.body.reply_id;
    
        if(!board) return response.status(400).send('no board specified')
        else if(!reply_id) return response.status(400).send('no reply id');
    
        try{
          const updatedReply = await Reply.findByIdAndUpdate(reply_id, { reported: true });
                    
          if(!updatedReply){
            return response.status(200).send('success');
          } else{
            return response.status(400).send('no reply found for id');
          }          
        } catch(e){
          console.log('ERROR PUT /api/replies/:board', e)
          next(e)          
        }
      })
  
  /* 9. DELETE Reply
       I can delete a post(just changing the text to '[deleted]') 
       if I send a DELETE request to /api/replies/{board} and pass
       along the thread_id, reply_id, & delete_password. (Text 
       response will be 'incorrect password' or 'success')
  */
     .delete(async (request, response, next) => {
    
        const board = request.params.board;
        const reply_id = request.body.reply_id;
    
        if(!board) return response.status(400).send('no board specified')
        else if(!reply_id) return response.status(400).send('no reply id');
    
        try{
          
          const reply = await Reply.findById(reply_id)
          if(!reply) return response.status(400).send('no reply found for id')
                    
          await reply.remove();
                    
          response.status(204).end();
        } catch(e){
          console.log('ERROR DELETE /api/replies/:board', e)
          next(e)          
        }
      })
  // ----------------------------------------------------------
  
};
