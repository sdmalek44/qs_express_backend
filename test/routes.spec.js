const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server.js');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile.js')[environment]
const database = require('knex')(configuration)

beforeEach((done) => {
  database.migrate.rollback()
  .then(() => done())
  .catch(error => {
    throw error;
  })
});

beforeEach((done) => {
 database.migrate.latest()
   .then(() => done())
   .catch(error => {
     throw error;
   })
})

 beforeEach((done) => {
   database.seed.run()
     .then(() => done())
     .catch(error => {
       throw error;
     });
 });

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return a 404 for a route that doesnt exist', done => {
    chai.request(server)
    .get('/api/v1/foodsy')
    .end((err, response) => {
      response.should.have.status(404);
      done();
    })
  })
});

describe('API Routes', () => {
  describe('GET /api/v1/foods', (done)=> {
    it('should return all of the foods', done => {
      chai.request(server)
      .get('/api/v1/foods')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(6);
        response.body[0].id.should.equal(1);
        response.body[0].name.should.equal('Apple');
        response.body[0].calories.should.equal(80);
        done();
      })
    })
  })
  describe('GET /api/v1/foods/:id', (done)=> {
    it('should return one of the foods', done => {
      chai.request(server)
      .get(`/api/v1/foods/1`)
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.id.should.equal(1);
        response.body.name.should.equal('Apple');
        response.body.calories.should.equal(80);
        done();
      })
    })
    it('should return 404 status if food not found', (done) => {
      chai.request(server)
      .get('/api/v1/foods/8')
      .end((err, response) => {
        response.should.have.status(404)
        response.should.be.json;
        done();
      })
    })
  })



  describe('POST /api/v1/foods', (done) => {
    it('should create a food', (done) => {
      chai.request(server)
      .post('/api/v1/foods')
      .send({ food:
        {
          name: 'Fish',
          calories: '9'
        }
      })
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.id.should.equal(7);
        response.body.name.should.equal('Fish');
        response.body.calories.should.equal(9);
        done();
      })
    })
    it('should send 400 status if incorrect parameters', (done) => {
      chai.request(server)
      .post('/api/v1/foods')
      .send({food: {name: 'bob'}})
      .end((err, response) => {
        response.should.have.status(400);
        response.should.be.json;
        response.body.error.should.equal(
            'Expected format: { food: { name: <string>, calories: <string> }}')
        done();
      })
    })
  })

  describe('PATCH /api/v1/foods/:id', (done) => {
    it('should update food', (done) => {
      chai.request(server)
      .patch('/api/v1/foods/1')
      .send({ food:
        {
          name: 'Fish',
          calories: '9'
        }
      })
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.id.should.equal(1);
        response.body.name.should.equal('Fish');
        response.body.calories.should.equal(9);
        done();
      })
    })
    it('should send status 404 if food not found', (done) => {
      chai.request(server)
      .patch('/api/v1/foods/134')
      .send({food: { name: 'bob',
                     calories: '123'}})
      .end((err, response) => {
        response.should.have.status(404);
        response.should.be.json;
        response.body.status.should.equal('Food Not Found');
        done();
      })
    })
    it('should send 400 if incorrect parameters', (done) => {
      chai.request(server)
      .patch('/api/v1/foods/1')
      .send({food: { name: 'bob'}})
      .end((err, response) => {
        response.should.have.status(400);
        response.should.be.json;
        response.body.error.should.equal(
          'Expected format: { food: { name: <string>, calories: <string> }}'
        );
        done();
      })
    })
  })

  describe('DELETE /api/v1/foods', (done) => {
    it('should delete a food', (done) => {
      chai.request(server)
      .get('/api/v1/foods/5')
      .end((err, response) => {
        response.body.id.should.equal(5)
        response.body.name.should.equal('Spam')
        response.body.calories.should.equal(200)
        chai.request(server)
        .delete('/api/v1/foods/5')
        .end((err, response) => {
          response.should.have.status(204);
          chai.request(server)
          .get('/api/v1/foods/5')
          .end((err, response) => {
            response.should.have.status(404)
            done()
          })
        })
      })
    })
    it('should get a 404 if food not found', (done)=> {
      chai.request(server)
        .delete('/api/v1/foods/7')
        .end((err,response) => {
          response.should.have.status(404);
          done();
        })
    })
  })

  describe('GET /api/v1/meals', (done) => {
    it('can see all meals and associated foods', (done) => {
      chai.request(server)
        .get('/api/v1/meals')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array')
          response.body.length.should.equal(4)
          response.body[3].id.should.equal(4)
          response.body[3].name.should.equal('Dinner')
          response.body[3].foods.should.be.a('array')
          response.body[3].foods.length.should.equal(3)
          response.body[3].foods[0].should.have.property('id')
          response.body[3].foods[0].id.should.be.a('number')
          response.body[3].foods[0].should.have.property('name')
          response.body[3].foods[0].name.should.be.a('string')
          response.body[3].foods[0].should.have.property('calories')
          response.body[3].foods[0].calories.should.be.a('number')
          done()
        })
    })
  })
  describe('GET /api/v1/meals/:meal_id/foods', (done) => {
    it('should get a specific meal and its foods', (done) => {
      chai.request(server)
      .get('/api/v1/meals/2/foods')
      .end((err, response) => {
        response.should.have.status(200)
        response.should.be.json;
        response.body.should.be.a('object')
        response.body.should.have.property('id')
        response.body.should.have.property('name')
        response.body.should.have.property('foods')
        response.body.foods.should.be.a('array')
        response.body.foods[0].should.have.property('id')
        response.body.foods[0].should.have.property('name')
        response.body.foods[0].should.have.property('calories')
        done()
      })
    })
    it('should return a 404 status if meal non-existant', (done)=> {
      chai.request(server)
      .get('/api/v1/meals/34/foods')
      .end((err, response) => {
        response.should.have.status(404)
        done()
      })
    })
  })

  describe('POST /api/v1/meals/:meal_id/foods/:id', (done) => {
    it('adds a food to a meal', (done) => {
      chai.request(server)
        .get('/api/v1/meals/1/foods')
        .end((err, response) => {
          response.body.foods.length.should.equal(0)
        chai.request(server)
          .post('/api/v1/meals/1/foods/1')
          .end((err, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('object')
            response.body.should.have.property('message')
            response.body.message.should.be.a('string')
            chai.request(server)
              .get('/api/v1/meals/1/foods')
              .end((err, response) => {
                response.body.foods.length.should.equal(1)
                done()
              })
          })
      })
    })
    it('returns 404 if food or meal not found', (done) => {
      chai.request(server)
        .post('/api/v1/meals/1/foods/45')
        .end((err, response) => {
          response.should.have.status(404);
          done();
        })
    })
  })

  describe('DELETE /api/v1/meals/:meal_id/foods/:id', (done) => {
    it('removes a food from a meal', (done) => {
      chai.request(server)
        .get('/api/v1/meals/2/foods')
        .end((err, response) => {
          response.body.foods.length.should.equal(1)
          response.body.foods[0].id.should.equal(1)
          chai.request(server)
            .delete('/api/v1/meals/2/foods/1')
            .end((err, response) => {
              response.should.have.status(200)
              response.body.should.have.property('message')
              response.body.message.should.be.a('string')
              chai.request(server)
                .get('/api/v1/meals/2/foods')
                .end((err, response) => {
                  response.body.foods.length.should.equal(0)
                  done()
                })
            })
        })

    })
    it('returns 404 if meal or food does not exist', (done) => {
      chai.request(server)
        .delete('/api/v1/meals/45/foods/3')
        .end((err, response) => {
          response.should.have.status(404)
          response.body.status.should.equal('Unsuccessful')
          done()
        })
    })
  })
})
