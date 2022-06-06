const db = require( '../index' );
const jwt = require( 'jsonwebtoken' )
const bcrypt = require( 'bcrypt' );
const saltRounds = 10;
const { v4: uuid } = require( 'uuid' )


//POST - sign up & log in

exports.createNewUser = async ( req, res ) => {

    let { username, password } = req.body;

    if ( !username || !password ) {
        res.status( 400 ).send( {
            message: "username AND password required to create account"
        } );
        return
    }
    const encryptedPassword = await bcrypt.hash( password, saltRounds )

    const query = `
    INSERT INTO cocktails.user (id, username, password)
    VALUES
    (?, ?, ?);
    `;
    const placeholders = [ uuid(), username, encryptedPassword ];

    db.query( query, placeholders, ( err, results ) => {
        if ( err ) {
            if ( err.errno === 1062 ) {
                res.status( 400 ).send( {
                    message: "username already taken",
                    error: err
                } )
            } else {
                res.status( 500 ).send( {
                    message: "There was an error creating your account. Please try again later.",
                    error: err
                } );
            }
        }
        else {
            // success  --> calls log in function to immediately log in
            this.login( req, res );
        }
    } )
}

exports.login = ( req, res ) => {

    let { username, password } = req.body;
    if ( !username || !password ) {
        res.status( 400 ).send( {
            message: 'Must include both username and password'
        } )
        return;
    }
    const query = `
            SELECT * FROM cocktails.user
            WHERE username = ?;        
        `;
    const placeholders = [ username ];
    
    db.query( query, placeholders, async ( err, results ) => {

        if ( err ) {
            res.status( 500 )
                .send( {
                    message: 'There was an error logging in. Try again later.',
                    error: err
                } );
        } else if ( results.length == 0 ) {
            res.status( 404 )
                .send( {
                    message: 'Account not found.',
                    error: err
                } )
        } else {

            const passwordMatched = await bcrypt.compare( password, results[ 0 ].password )
            if ( !passwordMatched ) {
                res.status( 400 ).send( {
                    message: "Password incorrect"
                } )
            } else {

                res.send( {
                    message: "Login successful! 🤗",
                    user: results[0]
                } )
            }
        }
    } );
}

//POST - favs & reviews

exports.addNewFavorite = ( req, res ) => {

    let { userId, drinkId } = req.body;

    if ( !userId || !drinkId ) {
        res.status( 400 ).send( {
            message: 'Must include drinkId'
        } )
        return;
    }

    const query = `
        INSERT INTO cocktails.favorite (userId, drinkId)
        VALUES
        (?, ?);
    `;

    const placeholders = [ userId, drinkId ];

    db.query( query, placeholders, ( err, results ) => {
        if ( err ) {
            res.status( 500 )
                .send( {
                    message: 'There was an error adding the cocktail to your favorites list',
                    error: err
                } );
        } else {
            res.send( {
                message: "Cocktail favorited 🤗"
            } )
        }
    } );

}



// DELETE

exports.deleteUserById = ( req, res ) => {
    let { id } = req.params;

    const query = `DELETE FROM cocktails.user 
                    WHERE (id = ?);`

    const placeholders = [ id ];

    db.query( query, placeholders, ( err, results ) => {
        if ( err ) {
            res.status( 500 )
                .send( {
                    message: 'There was an error deleting the account',
                    error: err
                } );
        } else if ( results.affectedRows == 0 ) {
            res.status( 404 )
                .send( {
                    message: "Could not complete delete request."
                } )
        } else {
            res.send( {
                message: 'The account was successfully deleted! 😬'
            } );
        }
    } );
}


exports.deleteFavorite = ( req, res ) => {
    let { userId, drinkId } = req.params;

    const query = `  
    DELETE FROM cocktails.favorite
        WHERE userId = ?
        AND drinkId = ?;
    `
    const placeholders = [ userId, drinkId ];

    db.query( query, placeholders, ( err, results ) => {
        if ( err ) {
            res.status( 500 )
                .send( {
                    message: 'There was an error deleting this drink from the favorites list',
                    error: err
                } );
        } else if ( results.affectedRows == 0 ) {
            res.status( 404 )
                .send( {
                    message: "Could not complete delete request."
                } )
        } else {
            res.send( {
                message: 'That favorite drink was successfully deleted from your list! 😬'
            } );
        }
    } );
}

