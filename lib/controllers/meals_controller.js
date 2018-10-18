const Meal = require('../models/meal.js')

class MealsController {
  static index(request, response){
    Meal.all()
      .then((meals) => {
        response.status(200).json(meals)
      })
      .catch((error) => {
        response.status(500).json({ error })
      })
  }

  static find_meal(request, response){
    Meal.find_meal(request)
      .then((meals) => {
        if (meals[0]){
          response.status(200).json(meals[0])
        } else {
          response.status(404).json({status: 404, error: 'Not Found'})
        }
      })
      .catch((error) => {
        response.status(500).json({ error })
      })
  }
}

module.exports = MealsController;
