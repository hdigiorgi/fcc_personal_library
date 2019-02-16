/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        res.body.forEach(element => {
          assert.exists(element.commentCount);
          assert.exists(element.title);
          assert.exists(element._id);
        })
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {
    var created = null;

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        const someTitle = "some random title"
        chai.request(server)
        .post('/api/books')
        .send({title: someTitle})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.exists(res.body._id)
          assert.equal(res.body.commentCount, 0)
          assert.equal(res.body.title, someTitle)
          created = res.body;
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 400);
          assert.strictEqual(res.body.error, 'no title')
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          res.body.forEach(element => {
            assert.exists(element.commentCount);
            assert.exists(element.title);
            assert.exists(element._id);
          })
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/some_id')
        .end(function(err, res){
          assert.equal(res.status, 404);
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get(`/api/books/${created._id}`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.strictEqual(res.body.title, created.title);
          assert.exists(res.body.commentCount);
          assert.exists(res.body.comments);
          done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        const comment = 'some random comment';
        chai.request(server)
        .post(`/api/books/${created._id}`)
        .send({comment})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.strictEqual(res.body.title, created.title);
          assert.equal(res.body.commentCount, 1);
          assert.deepStrictEqual(res.body.comments, [comment]);
          done();
        });
      });
      
    });

  });

});
