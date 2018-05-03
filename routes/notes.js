'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');


//ERROR HANDLING USING NEXT, TESTS THAT ANTICIPATE ERROR HANDLING


/* ========== GET/READ ALL ITEM ========= */
router.get('/', (req, res, next) => {

  const { searchTerm } = req.query;
  const { folderId } = req.query;
  

  let regSearch = {};
  let query;


  if (searchTerm) {
    regSearch = { $regex: new RegExp(searchTerm, 'i') };
    query = {$or: [ {title: regSearch } , {content: regSearch} ] };
  } else if (folderId) {
    regSearch = { $regex: new RegExp(searchTerm, 'i') };
    query = {$or: [ {title: regSearch } , {content: regSearch} ] };
  }


  return Note.find(query)
    .sort('created')
    .then(list => {
      res.json(list);
    });


  ///should return to next error
  // .catch(console.error);


});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {

  const id = req.params.id;
  
  return Note.findById(id)
    .then(list => {
      res.json(list);
    })

    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error(err);
    });

});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
       
  const createdObj = {};
  const updatableFields =['title', 'content'];
  
  updatableFields.forEach(field => {
    if (req.body[field]) {
      createdObj[field] = req.body[field];
    }
  });
  


  return Note.create(createdObj)
    .then(list => {
      res.location().status(201).json(list);
    })
    .catch(console.error)
    
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error(err);
    });

});


/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {


  const id = req.params.id;
  const validUpdates = {};
  const updatableFields =['title', 'content'];

  updatableFields.forEach(field => {
    if (req.body[field]) {
      validUpdates[field] = req.body[field];
    }});


  return Note.findByIdAndUpdate(id, { $set: validUpdates}, {new:true, upsert:false})
    .then(list => {
      res.status(204);
    })

    .catch(next);

});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {

  const id = req.params.id;
  
  return Note.findByIdAndRemove(id)
    .then(note => {
      res.status(204).end();
    })
    .catch(console.error)


    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error(err);
    });
});


module.exports = router;