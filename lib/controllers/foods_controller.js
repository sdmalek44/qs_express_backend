const Food = require('../models/food.js')

class FoodsController {
  static index(request, response) {
    Food.all()
      .then((foods) => {
        response.status(200).json(foods)
      })
      .catch((error) => {
        response.status(500).json({ error })
      })
  }

  static show(request, response){
    Food.find_food(request.params.id)
      .then((food) => {
        var status = 404;
        if (food) { status = 200 }
          response.status(status).json(food)
      })
      .catch((error) => {
        response.status(500).json({ error })
      })
  }

  static create(request, response){
    var data = request.body
    if (data.food.name && Number.isInteger(parseInt(data.food.calories))){
      Food.create(data)
        .then((food) => {
          response.status(200).json(food)
        })
        .catch((err) => {
          response.status(500).json({ err })
        })
    } else {
      response.status(400).json({error: 'Expected format: { food: { name: <string>, calories: <string> }}'})
    }
  }
}

module.exports = FoodsController;
