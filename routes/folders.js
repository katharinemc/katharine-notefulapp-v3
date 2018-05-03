'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');
const Folder = require('../models/folder');

//GET ALL FOLDERS, SORT BY NAME
router.get('/', (req, res, next) => {

  const { searchTerm } = req.query;
    
  let regSearch = {};
  let query;


  if (searchTerm) {
    regSearch = { $regex: new RegExp(searchTerm, 'i') };
    query = {$or: [ {title: regSearch } , {content: regSearch} ] };
  }


  return Folder.find(query)
    .sort('name')
    .then(list => {
      res.json(list);
    });
});
//GET folder by ID.

router.get('/:id', (req, res, next) => {

  const id = req.params.id;
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   const err = new Error('Invalid \':id\'');
  //   err.status = 400;
  //   return next(err);
  // }

  Folder.findById(id)
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
 
});

//POST 
router.post('/', (req, res, next) => {
       
  const createdObj = {};
  const updatableFields =['name'];
  
  updatableFields.forEach(field => {
    if (req.body[field]) {
      createdObj[field] = req.body[field];
    }
  });

  return Folder.create(createdObj)
    .then(list => {
      res.location().status(201).json(list);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The folder name already exists');
        err.status = 400;
      }
      next(err);
    });

});

//PUT 
router.put('/:id', (req, res, next) => {


  const id = req.params.id;
  const validUpdates = {};
  const updatableFields =['name'];

  updatableFields.forEach(field => {
    if (req.body[field]) {
      validUpdates[field] = req.body[field];
    }});
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid \':id\'');
    err.status = 400;
    return next(err);
  }

  Folder.findByIdAndUpdate(id, { $set: validUpdates}, {new:true, upsert:false})
    .then((result) => {
      res.location(`${req.originalUrl}/${result.id}`).status(204).json(result);
    })

    .catch(next);

});

//DELETE
router.delete('/:id', (req, res, next) => {

  const id = req.params.id;
  
  return Folder.findByIdAndRemove(id)
    .then(folder => {
      res.status(204).end();
    })
    .catch(console.error)


    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error(err);
    });
});



module.exports = router;