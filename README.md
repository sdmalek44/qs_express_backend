
# Quantified Self API  
An application for tracking foods, and calories consumed at each meal. It is built using Node.js, Express, and Knex. It is tested using Mocha, and Chai. 

## Deployed Link
https://quant-self-api.herokuapp.com/
(see endpoints below)

## Running and testing it locally
(Enter everything after the `$` in your terminal/console)  

- Clone the repository
  ```
  $ git clone https://github.com/sdmalek44/quantified_self_be.git
  $ cd quantified_self_be
  ```
- In the root directory of the repository, run:
  ```
  $ npm install
  ```
- Create PostgreSQL Database
  ```
  $ psql 
  $ create database qs_express_backend;
  $ create database qs_express_test;
  $ \q
  ```
  
- Migrate and Seed Database:
  ```
  $ knex migrate:latest
  $ knex seed:run
  ```
### Running the server
- From the terminal, run:
  ```
  $ node server.js
  ```
- visit http://localhost:3000 for root
- see below for endpoints

### Running the tests
  ```
  $ mocha --exit
  ```
  
## Endpoints  
### Food Endpoints:   

  
#### GET /api/v1/foods

Returns all foods currently in the database  
``` 
[
  {
      "id": 1,
      "name": "Banana",
      "calories": 150
  },
  {
      "id": 2,
      "name": "Donut",
      "calories": 450
  }
]
``` 
  
#### GET /api/v1/foods/:id  

Returns the food object with the specific :id you’ve passed in or 404 if the food is not found  
  
 
#### POST /api/v1/foods 
Allows creating a new food with the parameters:  
``` 
{ "food": { "name": "Name of food here", "calories": "Calories here"} }  
```
If food is successfully created, the food item will be returned. If the food is not successfully created, a 400 status code will be returned. Both name and calories are required fields.  
#### DELETE /api/v1/foods/:id 

Will delete the food with the id passed in and return a 204 status code. If the food can’t be found, a 404 will be returned.  
  
### Meal Endpoints:  

#### GET /api/v1/meals
 
Returns all the meals in the database along with their associated foods  
```
[
    {
        "id": 1,
        "name": "Breakfast",
        "foods": [
            {
                "id": 1,
                "name": "Banana",
                "calories": 150
            }
        ]
    },
    {
        "id": 2,
        "name": "Snack",
        "foods": [
            {
                "id": 9,
                "name": "Gum",
                "calories": 50
            }
        ]
    }
[
``` 

#### GET /api/v1/meals/:meal_id/foods
  
Returns all the foods associated with the meal with an id specified by :meal_id or a 404 if the meal is not found
```
{
    "id": 1,
    "name": "Breakfast",
    "foods": [
        {
            "id": 6,
            "name": "Yogurt",
            "calories": 550
        },
        {
            "id": 12,
            "name": "Apple",
            "calories": 220
        }
    ]
}
```

#### POST /api/v1/meals/:meal_id/foods/:id 

Adds the food with :id to the meal with :meal_id. If the meal/food cannot be found, a 404 will be returned.
If successful, returns a status code of 201 with following body:  
```
{
    "message": "Successfully added FOODNAME to MEALNAME"
}
```

#### DELETE /api/v1/meals/:meal_id/foods/:id

Removes the food with :id from the meal with :meal_id. If meal/food cannot be found, a 404 will be returned.  
```
{
    "message": "Successfully removed FOODNAME to MEALNAME"
}
```

