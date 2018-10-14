
exports.seed = function(knex, Promise) {
      return knex('foods').del()

        .then(() => {
          return Promise.all([
            knex('foods').insert([
              {name: 'Apple', calories: 80},
              {name: 'Donut', calories: 300},
              {name: 'Slim Jim', calories: 245},
              {name: 'Turkey', calories: 400},
              {name: 'Spam', calories: 200},
              {name: 'Green Pepper', calories: 40}
            ], 'id')
          ])
        })
        .catch(error => console.log(`Error Seeding Data: ${error}`))
};
