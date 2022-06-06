module.exports = (app) => {

    const reviews = require('../controllers/reviews.controller');
    
    app.get("/api/reviews/:drinkId", reviews.getReviewsByDrinkId);

    app.post("/api/reviews", reviews.addReview);

    app.delete("/api/reviews/:reviewId", reviews.deleteReview);
}