
exports.seed = function(knex, Promise) {
  return knex('meals').del()
    .then(function () {
      return knex('meals').insert([
        {name: 'Breakfast' },
        {name: 'Lunch' },
        {name: 'Snack' },
        {name: 'Dinner' }
      ], 'id');
    });
};
