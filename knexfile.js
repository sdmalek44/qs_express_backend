// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/qs_express_backend',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'postgresql',
    connection: 'postgres://iooqcvczjtnovd:11be7f3b90cfd7186d0e58123954dbfe482f6e8c063cb28afa78c3dc617335a3@ec2-54-221-225-11.compute-1.amazonaws.com:5432/ddhimtijdqip9n',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  }

};
