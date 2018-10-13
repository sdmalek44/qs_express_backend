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
  if (!data['food']){
    return response.status(400).send(error)
  } else if (!data.food['name'] || !data.food['name']){
    return response.status(400).send(error)
  }
  database('foods').insert(data.food, 'id')
    .then((food) => {
      response.status(200).json({ id: food } )
    })
    .catch((error) => {
      response.status(500).json({ error })
    })
})

app.delete('/api/v1/foods/:id', (request, response) => {
  database('foods').where('id', request.params.id).del()
    .then((food) => {
      var status = 200;
      if (food === 0){ status = 404}
      response.status(status).json({id: food})
    })
    .catch((error) => {
      response.status(500).json({ error })
    })
})

app.get('/api/v1/meals', (request, response) => {
  database.from('meals')
    .join('meal_foods', 'meals.id', '=', 'meal_foods.meal_id')
    .join('foods', 'meal_foods.food_id', '=', 'foods.id')
    .select('meals.id', 'meals.name', 'meal_foods.food_id', 'foods.name as food_name', 'foods.calories')
    .orderBy('meals.id')
    .then((meals) => {
      var formattedData = []
      var meal_ids = []
      for(var i=0; i < meals.length; i++){
        if (meal_ids.includes(meals[i].id)){
          formattedData[meal_ids.indexOf(meals[i].id)]
            .foods.push({id: meals[i].food_id,
                         name: meals[i].food_name,
                         calories: meals[i].calories})
        } else {
          meal_ids.push(meals[i].id);
          formattedData.push({ id: meals[i].id,
                               name: meals[i].name,
                               foods: [ {id: meals[i].food_id,
                                         name: meals[i].food_name,
                                         calories: meals[i].calories} ]})
        }
      }
      response.status(200).json(formattedData)
    })
})
