const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile.js')[environment];
const database = require('knex')(configuration);

class Meal {



  static all(){
    return database('meals')
      .leftJoin('meal_foods', 'meals.id', '=', 'meal_foods.meal_id')
      .leftJoin('foods', 'meal_foods.food_id', '=', 'foods.id')
      .select('meals.id', 'meals.name', 'meal_foods.food_id', 'foods.name as food_name', 'foods.calories')
      .orderBy('meals.id')
        .then((meals) => {
          return formatMeals(meals)
        })
  }

  static find_meal(request){
    return database('meals')
      .leftJoin('meal_foods', 'meals.id', '=', 'meal_foods.meal_id')
      .leftJoin('foods', 'meal_foods.food_id', '=', 'foods.id')
      .where('meals.id', request.params.meal_id)
      .select('meals.id', 'meals.name', 'meal_foods.food_id', 'foods.name as food_name', 'foods.calories')
      .then((meals) => {
          return formatMeals(meals)
        })
  }
}

function formatMeals(meals){
  var formattedData = []
  var meal_ids = []
  for(var i=0; i < meals.length; i++){
    var food = {
      id: meals[i].food_id,
      name: meals[i].food_name,
      calories: meals[i].calories
    }

    if (meal_ids.includes(meals[i].id) && meals[i].food_id) {
      formattedData[meal_ids.indexOf(meals[i].id)].foods.push(food)
    } else if (meals[i].food_id) {
      meal_ids.push(meals[i].id)
      formattedData.push({
        id: meals[i].id,
        name: meals[i].name,
        foods: [ food ]
      })
    } else {
      meal_ids.push(meals[i].id)
      formattedData.push({
        id: meals[i].id,
        name: meals[i].name,
        foods: []
      })
    }
  }
  return formattedData;
}

module.exports = Meal;
