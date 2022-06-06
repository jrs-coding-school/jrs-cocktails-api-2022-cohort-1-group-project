module.exports = (app) => {

    const users = require('../controllers/users.controller');

    
    // GET REQUESTS
    
    // POST REQUESTS
    app.post( "/api/users/signup", users.createNewUser);
    app.post( "/api/users/login", users.login );
    
    app.post( "/api/users/favorite", users.addNewFavorite );
    
    
    // DELETE REQUESTS
    
    app.delete( "/api/users/:id", users.deleteUserById );
    
    app.delete( "/api/users/favorite/:userId/:drinkId", users.deleteFavorite );
    
    
}