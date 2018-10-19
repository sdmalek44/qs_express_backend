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

  static update(request, response){
    var error = {error: 'Expected format: { food: { name: <string>, calories: <string> }}'}
    if (request.body.food.name && Number.isInteger(parseInt(request.body.food.calories))){
      Food.update(request)
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
  }

  static delete_food(request, response){
    Food.delete_food(request)
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
  }
}

module.exports = FoodsController;
