/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {      
      /*
       chai.request(server)
        .post('/api/threads/apitest')
        .send({
        })
        .end(function(err, res) {
          assert.equal(res.status, 201);
          done();
        });
        */
    });
    
    suite('GET', function() {
      /*
       chai.request(server)
        .get('/api/threads/apitest')
        .query({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          done();
        })
        
        */
    });
    
    suite('DELETE', function() {
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
    
    suite('PUT', function() {
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
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      /*
       chai.request(server)
        .post('/api/replies/apitest')
        .send({
          thread_id: ''
        })
        .end(function(err, res) {
          assert.equal(res.status, 201);
          done();
        });
        */
    });
    
    suite('GET', function() {
      /*
       chai.request(server)
        .get('/api/replies/apitest?thread_id=')
        
        */
    });
    
    suite('PUT', function() {
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
    
    suite('DELETE', function() {
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
