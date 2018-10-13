
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries

  return Promise.all([
    knex('meal_foods').insert({
      food_id: 1, meal_id: 2 }, 'id'),
    knex('meal_foods').insert({
      food_id: 4, meal_id: 3 }, 'id'),
    knex('meal_foods').insert({
      food_id: 2, meal_id: 3 }, 'id'),
    knex('meal_foods').insert({
      food_id: 1, meal_id: 4 }, 'id'),
    knex('meal_foods').insert({
      food_id: 3, meal_id: 4 }, 'id'),
    knex('meal_foods').insert({
      food_id: 2, meal_id: 4 }, 'id')
    .then(() => console.log('Seeding mealFoods complete!'))
    .catch(error => console.log(`Error seeding mealFoods data: ${error}`))
  ])
};
