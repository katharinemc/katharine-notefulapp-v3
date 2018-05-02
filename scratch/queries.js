'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

mongoose.connect(MONGODB_URI)
//find by search  
  // .then(() => {
  //   const searchTerm = 'lady gaga';
  //   let filter = {};

  //   if (searchTerm) {
  //     const re = new RegExp(searchTerm, 'i');
  //     filter.title = { $regex: re };
  //   }

  //   return Note.find(filter)
  //     .sort('created')
  //     .then(results => {
  //       console.log(results);
  //     })
  //     .catch(console.error);
  // })


  //findbyId
  // .then (() => {
  //   const id = '000000000000000000000002';

  //   return Note.findById(id)
  //     .then(results => {
  //       console.log(results);
  //     })
  //     .catch(console.error);


  // })


  //create

  // .then ( () => {
  //   const sampleReq = {
  //     title: 'tester note',
  //     content: 'here we are then'
  //   };

  //   const createdObj = {};
  //   const updatableFields =['title', 'content'];

  //   updatableFields.forEach(field => {
  //     if (sampleReq[field]) {
  //       createdObj[field] = sampleReq[field];
  //     }
  //   });

  //   return Note.create(createdObj)
  //     .then(results => {
  //       console.log(results);
  //     })
  //     .catch(console.error);

  // })

  //Update using Note.findByIdAndUpdate
  // .then ( () => {
  //   const id = '000000000000000000000007';

  //   const sampleReqBody = {
  //     'title': 'I different!',
  //     'content': 'and very special'
  //   };

  //   const validUpdates = {};

  //   const updatableFields =['title', 'content'];

  //   updatableFields.forEach(field => {
  //     if (sampleReqBody[field]) {
  //       validUpdates[field] = sampleReqBody[field];
  //     }
  //   });

  //   console.log(validUpdates);

  //   return Note.findByIdAndUpdate(id, { $set: validUpdates}, {new:true, upsert:false})
  //     .then(results => {
  //       console.log(results);
  //     })
  //     .catch(console.error);
  // })


  //Delete a note by id using Note.findByIdAndRemove

  // .then ( () => {
  //   const id = '000000000000000000000002';

  //   return Note.findByIdAndRemove(id)
  //     .then(results => {
  //       console.log(results);
  //     })
  //     .catch(console.error);

  // })



  
  .then(() => {
    return mongoose.disconnect()
      .then(() => {
        console.info('Disconnected');
      });
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });