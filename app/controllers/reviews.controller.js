const db = require( '../index' );

exports.addReview = ( req, res ) => {

    let { userId, drinkId, rating, comment } = req.body;

    if ( !userId || !drinkId || !rating ) {
        console.log( req.body )
        res.status( 400 ).send( {
            message: 'Must include user, drink, rating'
        } )
        return;
    }

    const query = `
        INSERT INTO cocktails.review 
            (userId, drinkId, rating, comment)
        VALUES
            (?, ?, ?, ?);
        `;

    const placeholders = [ userId, drinkId, rating, comment ];

    db.query( query, placeholders, ( err, results ) => {
        if ( err ) {
            res.status( 500 )
                .send( {
                    message: 'There was an error adding a review.',
                    error: err
                } );
        } else {
            res.send( {
                message: "Review posted! 🤗"
            } )
        }
    } );

}

exports.deleteReview = ( req, res ) => {
    let { userId, drinkId } = req.params;

    const query = `  
    DELETE FROM cocktails.review
        WHERE userId = ?
        AND drinkId = ?;
    `
    const placeholders = [ userId, drinkId ];

    db.query( query, placeholders, ( err, results ) => {
        if ( err ) {
            res.status( 500 )
                .send( {
                    message: 'There was an error deleting this review',
                    error: err
                } );
        } else if ( results.affectedRows == 0 ) {
            res.status( 404 )
                .send( {
                    message: "Could not delete review"
                } )
        } else {
            res.send( {
                message: 'Review deleted. Buh-bye! 😬'
            } );
        }
    } );
}


exports.getReviewsByDrinkId = ( req, res ) => {

    let { drinkId } = req.params;

    const query = `
        SELECT * FROM review
            WHERE drinkId = ?
    `;

    const placeholders = [ drinkId ];

    db.query( query, placeholders, ( err, results ) => {
        if ( err ) {
            res.status( 500 )
                .send( {
                    message: 'There was a server error',
                    error: err
                } );
        } else if ( results.length == 0 ) {
            res.status( 404 )
                .send( {
                    message: 'no reviews found',
                    error: err
                } )
        } else {
            res.send( {
                // returns and array of objects with property of "drinkId: String"
                reviews: results
            } );
        }
    } );
}