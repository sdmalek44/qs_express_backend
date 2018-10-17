const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile.js')[environment];
const database = require('knex')(configuration);

class Food {
  static all() {
    return database('foods').select()
  }

  static find_food(id){
    return database('foods').where('id', id).first()
  }

  static create(data){
    if (data.food.name && Number.isInteger(parseInt(data.food.calories))){
      return database('foods').returning('*').insert(data.food, 'id')
    } else {
      return Promise.resolve(false)
    }
  }
}
  // '
module.exports = Food
