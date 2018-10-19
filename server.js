const express = require('express');
const app = express();
const bodyParser = require('body-parser')

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile.js')[environment]
const database = require('knex')(configuration)
const FoodsController = require('./lib/controllers/foods_controller.js')
const MealsController = require('./lib/controllers/meals_controller.js')
const Food = require('./lib/models/food.js')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Quantified Self'

app.get('/', (request, response) => {
  response.send('Welcome to the Quantified Self API')
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
})

app.get('/api/v1/foods', FoodsController.index)

app.get('/api/v1/foods/:id', FoodsController.show);

app.post('/api/v1/foods', FoodsController.create);

app.patch('/api/v1/foods/:id', FoodsController.update);

app.delete('/api/v1/foods/:id', FoodsController.delete_food);

app.get('/api/v1/meals', MealsController.index);

app.get('/api/v1/meals/:meal_id/foods', MealsController.show)

app.post('/api/v1/meals/:meal_id/foods/:id', MealsController.create)

app.delete('/api/v1/meals/:meal_id/foods/:id', MealsController.destroy);

module.exports = app;
