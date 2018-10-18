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

app.get('/api/v1/meals/:meal_id/foods', MealsController.find_meal);

app.post('/api/v1/meals/:meal_id/foods/:id', (request, response) => {
    var mealObj;
    var foodObj;
    database('meals').where('id', request.params.meal_id).first()
      .then((meal) => {
        mealObj = meal;
        return database('foods').where('id', request.params.id).first()
      })
      .then((food) => {
        foodObj = food;
      })
      .then(() => {
        if (foodObj && mealObj){
          return database('meal_foods').insert([{
            meal_id: request.params.meal_id,
            food_id: request.params.id
          }], 'id')
        }
      })
      .then((result) => {
        if (result) {
          response.status(200).json({message: `Successfully added ${foodObj.name} to ${mealObj.name}`})
        } else {
          response.status(404).json({status: 'Not Found - Parameters Missing'})
        }
      })
      .catch((error) => {
        response.status(500).json({ error })
      })

})

app.delete('/api/v1/meals/:meal_id/foods/:id', (request, response) => {
  var foodObj;
  var mealObj;
  return database('foods').where('id', request.params.id).first()
    .then((food) => {
      foodObj = food;
      return database('meals').where('id', request.params.meal_id).first()
    })
    .then((meal) => {
      mealObj = meal;
    })
    .then(() => {
      return database('meal_foods').where({
        food_id: request.params.id,
        meal_id: request.params.meal_id
      })
    })
    .then((mealFoods) => {
      if (foodObj && mealObj) {
        return database('meal_foods').where('id', mealFoods[0].id).del()
      }
    })
    .then((result) => {
      if (result){
        response.status(200).json({message: `Successfully removed ${foodObj.name} from ${mealObj.name}`})
      } else {
        response.status(404).json({status: 'Unsuccessful'})
      }

    })
    .catch((error) => {
      response.status(500).json({ error })
    })
})

function formatMeals(meals){
  var formattedData = []
  var meal_ids = []
  for(var i=0; i < meals.length; i++){
    var food = {id: meals[i].food_id,
                name: meals[i].food_name,
                calories: meals[i].calories}

    if (meal_ids.includes(meals[i].id) && meals[i].food_id) {
      formattedData[meal_ids.indexOf(meals[i].id)].foods.push(food)
    } else if (meals[i].food_id) {
      meal_ids.push(meals[i].id)
      formattedData.push({ id: meals[i].id,
                           name: meals[i].name,
                           foods: [ food ]})
    } else {
      meal_ids.push(meals[i].id)
      formattedData.push({ id: meals[i].id,
                           name: meals[i].name,
                           foods: []
                         })
    }
  }
  return formattedData;
}

module.exports = app;
