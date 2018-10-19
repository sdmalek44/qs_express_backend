
exports.seed = function(knex, Promise) {
  var date = new Date(2018, 10, 16)
  var date2 = new Date(2018, 10, 17)
  var date3 = new Date(2018, 10, 18)
  return Promise.all([
    knex('meal_foods').insert({
      food_id: 1, meal_id: 2, created_at: date, updated_at: date }, 'id'),
    knex('meal_foods').insert({
      food_id: 4, meal_id: 3, created_at: date, updated_at: date }, 'id'),
    knex('meal_foods').insert({
      food_id: 2, meal_id: 3, created_at: date, updated_at: date }, 'id'),
    knex('meal_foods').insert({
      food_id: 1, meal_id: 4, created_at: date, updated_at: date }, 'id'),
    knex('meal_foods').insert({
      food_id: 3, meal_id: 4, created_at: date, updated_at: date }, 'id'),
    knex('meal_foods').insert({
      food_id: 2, meal_id: 4, created_at: date, updated_at: date }, 'id'),
    knex('meal_foods').insert({
      food_id: 1, meal_id: 2, created_at: date2, updated_at: date2 }, 'id'),
    knex('meal_foods').insert({
      food_id: 4, meal_id: 3, created_at: date2, updated_at: date2 }, 'id'),
    knex('meal_foods').insert({
      food_id: 2, meal_id: 3, created_at: date2, updated_at: date2 }, 'id'),
    knex('meal_foods').insert({
      food_id: 1, meal_id: 4, created_at: date2, updated_at: date2 }, 'id'),
    knex('meal_foods').insert({
      food_id: 3, meal_id: 4, created_at: date2, updated_at: date2 }, 'id'),
    knex('meal_foods').insert({
      food_id: 2, meal_id: 4, created_at: date2, updated_at: date2 }, 'id'),
    knex('meal_foods').insert({
      food_id: 1, meal_id: 2, created_at: date3, updated_at: date3 }, 'id'),
    knex('meal_foods').insert({
      food_id: 4, meal_id: 3, created_at: date3, updated_at: date3 }, 'id'),
    knex('meal_foods').insert({
      food_id: 2, meal_id: 3, created_at: date3, updated_at: date3 }, 'id'),
    knex('meal_foods').insert({
      food_id: 1, meal_id: 4, created_at: date3, updated_at: date3 }, 'id'),
    knex('meal_foods').insert({
      food_id: 3, meal_id: 4, created_at: date3, updated_at: date3 }, 'id'),
    knex('meal_foods').insert({
      food_id: 2, meal_id: 4, created_at: date3, updated_at: date3 }, 'id')
  ])
};
