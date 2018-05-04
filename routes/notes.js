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
    const { tagsId } = req.query;

    console.log(tagsId);
  let regSearch = {};
  let query;


  if (searchTerm) {
    regSearch = { $regex: new RegExp(searchTerm, 'i') };
    query = {$or: [ {title: regSearch } , {content: regSearch} ] };
  } else if (tagsId) {
     query = {tags: [tagsId] };
  }

  console.log(query);

  return Note.find(query)
    .sort('created')
    .populate('tags')
    .then(list => {
      res.json(list);
    })
    .catch(err => {
      next(err);
    });


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
  const { folderId } = req.body;
    
  const createdObj = {};
  const updatableFields =['title', 'folderId', 'content'];
  const keys = Object.keys(req.body);


  updatableFields.forEach(field => {
    if (req.body[field]) {
      createdObj[field] = req.body[field];
    } 
  });

  keys.forEach(key => {
    const validkey = updatableFields.includes(key);
    console.log(validkey);

    if(!updatableFields.includes(key)){
      const error = new Error('Contains invalid keys');
      error.status = 400;
      return next(error);
    }
  });

  if (!mongoose.Types.ObjectId.isValid(folderId)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  } else {
    createdObj.folderId = req.body.folderId;
  }

  return Note.create(createdObj)
    .then(list => {
      res.location().status(201).json(list);
    }) 
    .catch(err => {
      next(err);
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