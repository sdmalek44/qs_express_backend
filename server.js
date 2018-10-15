const express = require('express');
const app = express();
const bodyParser = require('body-parser')

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile.js')[environment]
const database = require('knex')(configuration)

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

app.get('/api/v1/foods', (request,response) => {
  database('foods').select()
    .then((foods) => {
      response.status(200).json(foods)
    })
    .catch((error) => {
      response.status(500).json({ error })
    })
});

app.get('/api/v1/foods/:id', (request, response) => {
  database('foods').where('id', request.params.id).first()
    .then((food) => {
      var status = 404;
      if (food) { status = 200 }
        response.status(status).json(food)
    })
    .catch((error) => {
      response.status(500).json({ error })
    })
});

app.post('/api/v1/foods', (request, response) => {
  const data = request.body
  var error = {error: 'Expected format: { food: { name: <string>, calories: <string> }}'}
  if (data.food.name && Number.isInteger(parseInt(data.food.calories))){
    database('foods').insert(data.food, 'id')
    .then((food_id) => {
      return database('foods').where('id', food_id[0]).first()
    })
    .then((food) => {
      response.status(200).json(food)
    })
    .catch((err) => {
      response.status(500).json({ err })
    })
  } else {
    response.status(400).json(error)
  }
});

app.patch('/api/v1/foods/:id', (request, response) => {
  var error = {error: 'Expected format: { food: { name: <string>, calories: <string> }}'}
  if (request.body.food.name && Number.isInteger(parseInt(request.body.food.calories))){
    return database('foods').where('id', request.params.id).update({
      name: request.body.food.name,
      calories: request.body.food.calories
    })
    .then((result) => {
      if (result){
        return database('foods').where('id', request.params.id).first()
      }
    })
    .then((food) => {
      if (food){
        response.status(200).json(food)
      } else {
        response.status(404).json({status: 'Food Not Found'})
      }
    })
  } else {
    response.status(400).json(error)
  }
})

app.delete('/api/v1/foods/:id', (request, response) => {
  return database('foods').where('id', request.params.id).del()
    .then((result) => {
      if (parseInt(result)){
        response.status(204).json({id: parseInt(result)})
      } else {
        response.status(404).json({status: "Food Not Found"})
      }
    })
    .catch((err) => {
      response.status(500).json({ error: err })
    })
})

app.get('/api/v1/meals', (request, response) => {
  database('meals')
    .leftJoin('meal_foods', 'meals.id', '=', 'meal_foods.meal_id')
    .leftJoin('foods', 'meal_foods.food_id', '=', 'foods.id')
    .select('meals.id', 'meals.name', 'meal_foods.food_id', 'foods.name as food_name', 'foods.calories')
    .orderBy('meals.id')
    .then((meals) => {
      response.status(200).json(formatMeals(meals)) })
    .catch((error) => {
      response.status(500).json({ error }) })
})

app.get('/api/v1/meals/:meal_id/foods', (request, response) => {
  database('meals')
    .leftJoin('meal_foods', 'meals.id', '=', 'meal_foods.meal_id')
    .leftJoin('foods', 'meal_foods.food_id', '=', 'foods.id')
    .where('meals.id', request.params.meal_id)
    .select('meals.id', 'meals.name', 'meal_foods.food_id', 'foods.name as food_name', 'foods.calories')
    .then((meals) => {
      var status = 404;
      var body = {status: 404, error: 'Not Found'}
      if (meals.length !== 0){
        status = 200
        body = formatMeals(meals)[0]
      }
      response.status(status).json(body) })
    .catch((error) => {
      response.status(500).json({ error }) })
})

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
