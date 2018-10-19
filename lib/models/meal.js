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

function mealExist(meal, meal_ids){
  return meal_ids.includes(meal.id)
}

function addToExistingMealFood(meal, food, meal_ids, new_obj){
  new_obj[meal_ids.indexOf(meal.id)].foods.push(food)
  return new_obj;
}

function addNewMealAndFood(meal, food, new_obj){
  if (food.id) {
    new_obj.push(meal)
    meal.foods.push(food)
  } else {
    new_obj.push(meal)
  }
  return new_obj;
}

function formatMeal(meal){
  return {
            id: meal.id,
            name: meal.name,
            foods: []
          }
}

function formatFood(meal){
  return {
            id: meal.food_id,
            name: meal.food_name,
            calories: meal.calories
          }
}

function formatMeals(meals){
  var formattedData = []
  var meal_ids = []
  for(var i=0; i < meals.length; i++){
    var food = formatFood(meals[i])
    var meal = formatMeal(meals[i])
    if (mealExist(meal, meal_ids) && food.id){
      formattedData = addToExistingMealFood(meal, food, meal_ids, formattedData)
    } else {
      formattedData = addNewMealAndFood(meal, food, formattedData)
      meal_ids.push(meal.id)
    }
  }
  return formattedData;
}

module.exports = Meal;
