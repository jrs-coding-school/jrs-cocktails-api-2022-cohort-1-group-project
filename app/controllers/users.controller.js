const db = require( '../index' );
const jwt = require( 'jsonwebtoken' )
const bcrypt = require( 'bcrypt' );
const saltRounds = 10;
const { v4: uuid } = require( 'uuid' )


exports.creatNewUser = async ( req, res ) => {
    
    let { email, password } = req.body;
    
    if ( !email || !password ) {
        res.status( 400 ).send( {
            message: "email AND password required to create account"
        } );
        return
    }
    const encryptedPassword = await bcrypt.hash( password, saltRounds )

    const query = `
    INSERT INTO cocktails.user (id, email, password)
    VALUES
    (?, ?, ?);
    `;
    const placeholders = [ uuid(), email, encryptedPassword ];

    db.query( query, placeholders, ( err, results ) => {
        if ( err ) {
            if ( err.errno === 1062 ) {
                res.status( 400 ).send( {
                    message: "email already taken",
                    error: err
                } )
            } else {
                res.status( 500 ).send( {
                    message: "There was an error creating your account. Please try again later.",
                    error: err
                } );
            }
        } else {
            // success  --> calls log in function to immediately log in
            this.login( req, res );
        }
    } )
}


exports.login = ( req, res ) => {
    
    let { email, password } = req.body;
    
    if ( !email || !password ) {
        res.status( 400 ).send( {
            message: 'Must include both email and password.'
        } )
        return;
    }
    const query = `
            SELECT * FROM urls.users
            WHERE email = ?;        
        `;
    const placeholders = [ email ];
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
                let user = results[ 0 ];
                const token = jwt.sign( {
                    userId: user.id,
                    email: user.email
                },
                    "abc123",
                    {
                        expiresIn: '2h',
                    } );
                user.token = token;

                res.send( {
                    message: "Login successful! 🤗",
                    user
                } )
            }
        }
    } );
}


exports.deleteUserById = ( req, res ) => {
    let { id } = req.params;

    const query = `DELETE FROM user 
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
            // console.log( results )
            res.send( {
                message: 'The account was successfully deleted! 😬'
            } );
        }
    } );
}
exports.makePasswords =async ( req, res ) => {
    const pass = []
    for (let i = 0; i < 10; i++) {
        const encryptedPassword = await bcrypt.hash( 'pass', saltRounds )
        pass.push(encryptedPassword)
        
    }
    res.send(pass)
}

