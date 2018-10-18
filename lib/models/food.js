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
    return database('foods').insert(data.food, 'id')
      .then((food) => {
        if (food[0]){
          return database('foods').where('id', food[0]).first()
        }
      })
  }
}
  // '
module.exports = Food
