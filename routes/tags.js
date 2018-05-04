'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');
const Folder = require('../models/folder');
const Tag = require('../models/tag');

//GET all tags and search by tags;
router.get('/', (req, res, next) => {
  const { searchTerm } = req.query;
  console.log('Im in tags router!');
  let regSearch = {};
  let query;

  if (searchTerm) {
    regSearch = { $regex: new RegExp(searchTerm, 'i') };
    query =  {name: regSearch};
  }

  return Tag.find(query)
    .sort('name')
    .then(list => {
      res.json(list);
    });

});


// //GET one tag by id
router.get('/:id', (req, res, next) => {

  const id = req.params.id;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid \':id\'');
    err.status = 400;
    return next(err);
  }

  return Tag.findById(id)
    .then(list => {
      res.status(200).json(list);
    })

    .catch(err => {
      next(err);
    });


});


// POST /tags to create a new tag
router.post('/', (req, res, next) => {
  console.log(req.body.name);
       
  const createdObj = {};
  const updatableFields =['name'];
  
  updatableFields.forEach(field => {
    if (req.body[field]) {
      createdObj[field] = req.body[field];
    }
  });

  
  if(!createdObj.name){
    const err = new Error('Must provide \'name\'');
    err.status = 400;
    return next(err);
  }

  return Tag.create(createdObj)
    .then(list => {
      res.location().status(201).json(list);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The tag name already exists');
        err.status = 400;
      }
      next(err);
    });
});

// PUT /tags by id to update a tag
router.put('/:id', (req, res, next) => {


  const id = req.params.id;
  const validUpdates = {};
  const updatableFields =['name'];

  updatableFields.forEach(field => {
    if (req.body[field]) {
      validUpdates[field] = req.body[field];
    }});

      
  if(!validUpdates.name){
    const err = new Error('Must provide \'name\'');
    err.status = 400;
    return next(err);
  }
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid \':id\'');
    err.status = 400;
    return next(err);
  }

  Tag.findByIdAndUpdate(id, { $set: validUpdates}, {new:true, upsert:false})
    .then((result) => {
      res.location(`${req.originalUrl}/${result.id}`).status(204).json(result);
    })

    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The tag name already exists');
        err.status = 400;
      }
      next(err);
    });

});
//DELETE by id deletes the tag AND removes it from the notes collection
router.delete('/:id', (req, res, next) => {

  const id = req.params.id;
  

  return Tag.findByIdAndRemove(id)
    .then ( () => {
      return Note.updateMany(
        { $pull: { tags: id } }
      );
    })
    .then( results => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });

     

});



module.exports = router;


