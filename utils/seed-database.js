'use strict';

const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');
const Folder = require('../models/folder');
const Note = require('../models/note');

const seedFolders = require('../db/seed/folders');
const seedNotes = require('../db/seed/notes');


mongoose.connect(MONGODB_URI)
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
      Note.insertMany(seedNotes),
      Folder.insertMany(seedFolders),
      Folder.createIndexes(),
    ]);
  })
   
  .then((results)=> {
    console.info(`Inserted ${results[0].length} notes`);
    console.info(`Inserted ${results[1].length} folders`);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(err);
  });