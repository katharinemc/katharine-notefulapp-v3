// 'use strict';

// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const mongoose = require('mongoose');

// const app = require('../server');
// const { TEST_MONGODB_URI } = require('../config');

// const Folder = require('../models/folder');

// const seedFolders = require('../db/seed/folders');

// const expect = chai.expect;
// chai.use(chaiHttp);



// describe('Folder router testing', function () {
//   this.timeout(5000);
//   before(function () { 
//     console.log('before');
//     return mongoose.connect(TEST_MONGODB_URI)
//       .then( () => {
//         console.log('dropping database');
//         return mongoose.connection.db.dropDatabase();

//       });
//   });

//   beforeEach(function () {
//     console.log('before each');
//     return Folder.insertMany(seedFolders)
//       .then(() => Folder.createIndexes());
//   });

//   afterEach(function () {
//     console.log('after each');
//     return mongoose.connection.db.dropDatabase();
//   });


//   after(function () {
//     console.log('after');
//     return mongoose.disconnect();
//   });

//   //// POST
//   describe('POST /api/folders', function () {
//     it('should create and return a new folder when provided valid data', function () {
//       const newItem = {
//         'name': 'foobaloo',
//       };

//       let res;
//       // 1) First, call the API
//       return chai.request(app)
//         .post('/api/folders')
//         .send(newItem)
//         .then(function (_res) {
//           res = _res;
//           expect(res).to.have.status(201);
//           expect(res).to.be.json;
//           expect(res.body).to.be.a('object');
//           expect(res.body).to.have.keys('id', 'name');
//           // 2) then call the database
//           return Folder.findById(res.body.id);
//         })
//       // 3) then compare the API response to the database results
//         .then(data => {
//           expect(res.body.name).to.equal(data.name);

//         });
//     });

//     it('should error when provided invalid data', function () {
//       const newItem = {
//         'title': 'foobaloo',
//       };

//       let res;
//       // 1) First, call the API
//       return chai.request(app)
//         .post('/api/folders')
//         .send(newItem)
//         .then(function (_res) {
//           res = _res;
//           expect(res).to.have.status(500);
//         });
//     });
//   });

//   //// GET -- of do Mocha test for alphabetization?
//   describe('GET /api/folders', function () {
//     it ('should get all folders', function () {
//       return Promise.all([
//         Folder.find(),
//         chai.request(app).get('/api/folders')
//       ])
//       // 3) then compare database results to API response
//         .then(([data, res]) => {
//           expect(res).to.have.status(200);
//           expect(res).to.be.json;
//           expect(res.body).to.be.a('array');
//           expect(res.body).to.have.length(data.length);
//         });
//     });
//   });

//   describe('GET /api/folders/:id', function () {
//     it('should return correct object for valid id', function () {


//       let data;
//       // 1) First, call the database
//       return Folder.findOne()
//         .then(_data => {
//           data = _data;
//           // 2) then call the API with the ID
//           return chai.request(app)
//             .get(`/api/folders/${data.id}`);
//         })
//         .then((res) => {
//           expect(res).to.have.status(200);
//           expect(res).to.be.json;
    
//           expect(res.body).to.be.an('object');
//           expect(res.body).to.have.keys('id', 'name');
    
//           // 3) then compare database results to API response
//           expect(res.body.id).to.equal(data.id);
//           expect(res.body.name).to.equal(data.name);
//         });
//     });
  
//     it('should return an error for valid id', function () {
  
//       let id='notanid';

//       return chai.request(app)
//         .get(`/api/folders/${id}`)

//         .then((res) => {
//           expect(res).to.have.status(500);

  
//         });
      
//     });

//   });

//   /// DELETE
//   describe('DELETE /api/folders/:id', function () {
//     it('should delete provided ID if exists', function () {
//       let data;
//       let id = '000000000000000000000002';
    
//       Folder.findByIdAndRemove(id)
//         .then( () => {
//           return chai.request(app)
//             .delete(`/api/folders/${id}`);
//         }).then( (res) => {
//           expect(res).to.have.status(204);
//           expect(res.body).to.be.a('object');
    
//         });


//     });

//   });


//   //all tests end 
// });
