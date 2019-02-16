/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const book = require('../book');

function textResponse(res, promise) {
  promise.then(result => {
    if(result.error == 404) {
      res.status(404).send('')
    } else if(result.error) {
      res.status(400).send(result.error)
    } else {
      res.send(result)
    }
  })
}

function jsonResponse(res, promise) {
  promise.then(result => {
    if(result.error == 404) {
      res.status(404).send('')
    } else if(result.error) {
      res.status(400).json(result)
    } else {
      res.json(result);
    }
  })
}

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      jsonResponse(res, book.getAll())
    })
    
    .post(function (req, res){
      jsonResponse(res, book.create(req.body.title));
    })
    
    .delete(function(req, res){
      textResponse(res, book.deleteAll())
    });


  app.route('/api/books/:id')
    .get(function (req, res){
      jsonResponse(res, book.getOne(req.params.id))
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      jsonResponse(res, book.addComment(bookid, comment));
    })
    
    .delete(function(req, res){
      textResponse(res, book.deleteOne(req.params.id))
    });
  
};
