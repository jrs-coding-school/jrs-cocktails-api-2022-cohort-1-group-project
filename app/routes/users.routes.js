module.exports = (app) => {

    const users = require('../controllers/users.controller');

    
    // GET REQUESTS
    app.get("/api/users/favorite/:userId", users.getUserFavoritesById);
    
    
    // POST REQUESTS
    app.post( "/api/users/signup", users.createNewUser);
    app.post( "/api/users/login", users.login );
    
    app.post( "/api/users/review", users.addReview );
    app.post( "/api/users/favorite", users.addNewFavorite );
    
    
    // DELETE REQUESTS
    
    app.delete( "/api/users/:id", users.deleteUserById );
    
    app.delete( "/api/users/review/:userId/:drinkId", users.deleteReview );
    app.delete( "/api/users/favorite/:userId/:drinkId", users.deleteFavorite );
    
    // DO I HAVE DO THIS --v-- //
    // app.get("/api/passwords", users.makePasswords);
    
}