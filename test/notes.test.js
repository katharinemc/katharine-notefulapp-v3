'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');
const Note = require('../models/note');

const seedNotes = require('../db/seed/notes');

const expect = chai.expect;
chai.use(chaiHttp);


describe('notes router testing', function () {
  before(function () { 
    console.log('before');
    return mongoose.connect(TEST_MONGODB_URI)
      .then( () => {
        console.log('dropping database');
        return mongoose.connection.db.dropDatabase();

      });
  });

  beforeEach(function () {
    console.log('before each');
    return Note.insertMany(seedNotes);
    // .then(() => Note.createIndexes());
  });



  afterEach(function () {
    console.log('after each');
    return mongoose.connection.db.dropDatabase();
  });


  after(function () {
    console.log('after');
    return mongoose.disconnect();
  });


  describe('POST /api/notes', function () {
    it('should create and return a new item when provided valid data', function () {
      const newItem = {
        'title': 'The best article about cats ever!',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...'
      };

      let res;
      // 1) First, call the API
      return chai.request(app)
        .post('/api/notes')
        .send(newItem)
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id', 'title', 'content', 'createdAt', 'updatedAt');
          // 2) then call the database
          return Note.findById(res.body.id);
        })
        // 3) then compare the API response to the database results
        .then(data => {
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
        });
    });
  });

  // Serial Request - Call DB then call API then compare:
  describe('GET /api/notes/:id', function () {
    it('should return correct note', function () {
      let data;
      // 1) First, call the database
      return Note.findOne()
        .then(_data => {
          data = _data;
          // 2) then call the API with the ID
          return chai.request(app)
            .get(`/api/notes/${data.id}`);
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('id', 'title', 'content', 'createdAt', 'updatedAt');

          // 3) then compare database results to API response
          expect(res.body.id).to.equal(data.id);
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
        });
    });
  });

  // Parallel Request - Call both DB and API, then compare:
  describe('GET /api/notes', function () {
    // 1) Call the database **and** the API
    // 2) Wait for both promises to resolve using `Promise.all`
    return Promise.all([
      Note.find(),
      chai.request(app).get('/api/notes')
    ])
      // 3) then compare database results to API response
      .then(([data, res]) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(data.length);
      });
  });

  //PUT - NEEDS EDGE CASES AND VALIDATION CASES
  describe('PUT endpoint', function () {
    it('should give a 500 error for invalid ID', function () {
      const updateData = {
        title: 'cats cats cats',
        content: 'dogs dogs dogs',
      };
    
      let id = 'notanid';
      return chai.request(app)
        .put(`/api/notes/${id}`)
        .send(updateData)         
        .then((res) => {

    
          expect(res).to.have.status(500);

        });

    });


    it('should update if fields are valid', function() {
      const updateData = {
        title: 'cats cats cats',
        content: 'dogs dogs dogs',
      };
      let data;
      let id;

      //Get an ID from the data base
      return Note.findOne()
        .then(_data => {
          data = _data;
          id = data.id;
        })

      //Update it
        .then ( () => {
          Note.findByIdAndUpdate(id, updateData)
            .then(_data => {
              data = _data;
              return chai.request(app)
                .put(`/api/notes/${data.id}`)
                .send(updateData)         
                .then((res) => {

                  console.log(res.body);
                  expect(res).to.have.status(204);
                  expect(res).to.be.json;
    
                  expect(res.body).to.be.an('object');
                  expect(res.body).to.have.keys('id', 'title', 'content', 'createdAt', 'updatedAt');
    
                  // 3) then compare database results to API response
                  expect(res.body.id).to.equal(data.id);
                  expect(res.body.title).to.equal(data.title);
                  expect(res.body.content).to.equal(data.content);
                });

            });

        });

      //API call




    });
  });

  // DELETE - NEEDS HANDLING FOR ERRORS

  describe('DELETE endpoint', function () {
    it('should delete provided ID if exists', function () {
      let data;
      let id = '000000000000000000000002';

      Note.findByIdAndRemove(id)
        .then( () => {
          return chai.request(app)
            .delete(`/api/notes/${id}`);
        }).then( (res) => {
          expect(res).to.have.status(204);
          expect(res.body).to.be.a('object');

        });


    });});

//ALL NOTES TEST ENDING
});