module.exports = (app) => {

    const drinks = require('../controllers/drinks.controller');

    app.get("/api/drinks/random", drinks.getRandomDrink);
    // random must come above :id route-
    // DO NOT CHANGE ORDER
    app.get("/api/drinks/:id", drinks.getDrinkById);
    app.get("/api/drinks/favorites/:userId", drinks.getUserFavoritesById);

    app.get("/api/drinks/drinkname/:drinkName", drinks.getDrinksByName);
    app.get("/api/drinks/ingredients/:ingredient1", drinks.getDrinkByOneIngredient);
    app.get("/api/drinks/ingredients/:spirit/:ingredient", drinks.getDrinkByTwoIngredients);


}