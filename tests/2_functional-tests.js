/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var should = require("chai").should();
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("API ROUTING FOR /api/threads/:board", function() {
    suite("POST", function() {
      test("post with all required fields", done => {
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
            done();
          });
      });

      test("post with missing required fields", done => {
        chai
          .request(server)
          .post("/api/threads/apitest")
          .send({
            title: "apitest thread title",
            text: "apitest thread text"
          })
          .end(function(err, res) {
            assert.equal(res.status, 400);
            done();
          });
      });
    });

    suite("GET", function() {
      test("should return an array of threads", done => {
        chai
          .request(server)
          .get("/api/threads/apitest")
          .query({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.isAtMost(res.body.length, 10);
            assert.property(res.body[0], "_id", "");
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
            if(res.body[0].replies.length > 0){
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
      /*
       chai.request(server)
        .delete('/api/threads/apitest')
        .send({
          thread_id: '',
          delete_password: ''
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          done();
        });        
        */
    });

    suite("PUT", function() {
      /*
       chai.request(server)
        .put('/api/threads/apitest')
        .send({
          thread_id: ''
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          done();
        });        
        */
    });
  });

  suite("API ROUTING FOR /api/replies/:board", function() {
    suite("POST", function() {
      /*
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
