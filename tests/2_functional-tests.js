/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

let mongoose = require("mongoose");
var chaiHttp = require("chai-http");
var chai = require("chai");
var should = require("chai").should();
var assert = chai.assert;
var server = require("../server");

const Thread = require("../models/thread");
const Reply = require("../models/reply");
const { test_threads, test_replies } = require('./test-helper')

chai.use(chaiHttp);

suite("Functional Tests", function() {
  let replyThreadId;
  before(done => {
    Reply.remove({}, err => {
      console.log("replies removed");
      Thread.remove({}, err => {
        console.log("threads removed");
        Thread.insertMany(test_threads, (err, threads) => {
          console.log('test threads inserted')
          replyThreadId = threads[0]._id;
          const replies = test_replies.map(r => ({...r, thread_id: replyThreadId, created_on: new Date('2021-12-12')}))
          Reply.insertMany(replies, (err, replies) => {
            console.log('test replies inserted')
            const reply_ids = replies.map(r => r._id);
            Thread.findByIdAndUpdate(replyThreadId, { bumped_on: new Date('2021-12-12'), replies: reply_ids }, { new: true }, (err, thread) => {
              done();
            })
          })
        })
      });
    });
  });

  after(done => {
    Reply.remove({}, err => {
      console.log("replies removed");
      Thread.remove({}, err => {
        console.log("threads removed");
        done();
      });
    });
  });

  suite("API ROUTING FOR /api/threads/:board", () => {
    suite("POST", function() {
      test("post with missing required fields", () => {
        chai
          .request(server)
          .post("/api/threads/apitest")
          .send({
            title: "apitest thread title",
            text: "apitest thread text"
          })
          .end((err, res) => {
            assert.equal(res.status, 400);
          });
      });

      test("post with all required fields", () => {
        chai
          .request(server)
          .post("/api/threads/apitest")
          .send({
            title: "apitest thread title",
            text: "apitest thread text",
            delete_password: "apitest"
          })
          .end(function(err, res) {
            assert.equal(res.status, 201);
          });
      });
    });
    suite("GET", function() {
      test("get an array of threads", done => {
        chai
          .request(server)
          .get("/api/threads/apitest")
          .query({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.isAtMost(res.body.length, 10);
            assert.property(res.body[0], "_id", "");
            assert.property(res.body[0], "title", "");
            assert.property(res.body[0], "text", "");
            assert.property(res.body[0], "created_on", "");
            assert.property(res.body[0], "bumped_on", "");
            assert.notProperty(
              res.body[0],
              "delete_password",
              "delete_password should not be present"
            );
            assert.notProperty(
              res.body[0],
              "reported",
              "reported should not be present"
            );

            // Replies
            assert.isArray(res.body[0].replies);
            assert.isAtMost(res.body[0].replies.length, 3);
            if (res.body[0].replies.length > 0) {         
              assert.property(res.body[0].replies[0], "_id", "");
              assert.property(res.body[0].replies[0], "thread_id", "");
              assert.property(res.body[0].replies[0], "created_on", "");
              assert.property(res.body[0].replies[0], "text", "");
            }
            done();
          });
      });
    });

    suite("DELETE", function() {
      let thread_id;
      beforeEach(done => {
        const newThread = new Thread({
          board: "apitest",
          title: "apitest delete thread title",
          text: "apitest delete thread text",
          delete_password: "apitest",
          created_on: new Date(),
          bumped_on: new Date()
        });
        newThread.save((err, thread) => {
          thread_id = thread._id;
          done();
        });
      });

      test("successful deletion", done => {
        chai
          .request(server)
          .delete("/api/threads/apitest")
          .send({
            thread_id: thread_id,
            delete_password: "apitest"
          })
          .end(function(err, res) {
            assert.equal(res.status, 204);
            done();
          });
      });

      test("invalid thread", done => {
        chai
          .request(server)
          .delete("/api/threads/apitest")
          .send({
            thread_id: "5ea6ccd02addf93f50487ccf",
            delete_password: "wrong password"
          })
          .end(function(err, res) {
            assert.equal(res.status, 400);
            done();
          });
      });

      test("incorrect password", done => {
        chai
          .request(server)
          .delete("/api/threads/apitest")
          .send({
            thread_id: thread_id,
            delete_password: "wrong password"
          })
          .end(function(err, res) {
            assert.equal(res.status, 401);
            done();
          });
      });

      test("no password", done => {
        chai
          .request(server)
          .delete("/api/threads/apitest")
          .send({
            thread_id: "5ea6ccd02addf93f50487ccf"
          })
          .end(function(err, res) {
            assert.equal(res.status, 401);
            done();
          });
      });
    });

    suite("PUT", function() {
      let thread_id;
      before(done => {
        const newThread = new Thread({
          board: "apitest",
          title: "apitest delete thread title",
          text: "apitest delete thread text",
          delete_password: "apitest",
          created_on: new Date(),
          bumped_on: new Date()
        });
        newThread.save((err, thread) => {
          thread_id = thread._id;
          done();
        });
      });

      test("successful update", done => {
        chai
          .request(server)
          .put("/api/threads/apitest")
          .send({
            thread_id: thread_id
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            done();
          });
      });
      test("invalid thread id", done => {
        chai
          .request(server)
          .put("/api/threads/apitest")
          .send({
            thread_id: "5ea6ccd02addf93f50487ccf"
          })
          .end(function(err, res) {
            assert.equal(res.status, 400);
            done();
          });
      });
    });
  });

  suite("API ROUTING FOR /api/replies/:board", function() {
    suite("POST", function() {
      /*
      test('successful post of a reply', )
       chai.request(server)
        .post('/api/replies/apitest')
        .send({
          thread_id: ''
        })
        .end(function(err, res) {
          // assert.equal(res.status, 201);
          // assert redirect
          done();
        });
        */
    });

    suite("GET", function() {
      /*
       chai.request(server)
        .get('/api/replies/apitest?thread_id=')
        
        */
    });

    suite("PUT", function() {
      /*
       chai.request(server)
        .put('/api/replies/apitest')
        .send({
          reply_id: ''
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          done();
        });
        */
    });

    suite("DELETE", function() {
      /*
       chai.request(server)
        .delete('/api/replies/apitest')
        .send({
          reply_id: '',
          delete_password: ''
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          done();
        });
        */
    });
  });
});
