'use strict';
const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({

  title: {type: String, required:true},
  content: {type: String},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
});

noteSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

const Note  = mongoose.model('Note', noteSchema);

module.exports =  Note;

