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

  static add_food_to_meal(request){
    var mealObj;
    var foodObj;
    return database('meals').where('id', request.params.meal_id).first()
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
        if (result){
          return {message: `Successfully added ${foodObj.name} to ${mealObj.name}`}
        } else {
          return {status: 'Not Found - Parameters Missing'}
        }
      })
  }

  static remove_meal_food(request){
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
        if(result){
          return {message: `Successfully removed ${foodObj.name} from ${mealObj.name}`}
        } else {
          return {status: 'Unsuccessful'}
        }
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
