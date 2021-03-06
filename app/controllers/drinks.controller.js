const db = require( '../index' );
const axios = require( "axios" );
const URL = "http://www.thecocktaildb.com/api/json/v1"

exports.getDrinkById = ( req, res ) => {

    let { id } = req.params;

    axios.get( `${URL}/1/lookup.php?i=${id}` )
        .then( ( results ) => {
            if ( results.data.drinks == undefined ) {
                res.status( 404 )
                    .send( {
                        message: 'THE RUM IS GONE!'
                    } )
            } else {
                res.send( {
                    drink: results.data.drinks[ 0 ]
                } )
            }
        } )
        .catch( ( err ) => {
            if ( err.status == undefined ) {
                res.status( 404 )
                    .send( {
                        message: 'OH NO! THE RUM IS GONE!',
                        error: err
                    } )
            } else {
                res.status( 500 )
                    .send( {
                        message: 'Oops! Server Error. Try again later',
                        error: err
                    } )
            }
        } )
}

exports.getDrinksByName = ( req, res ) => {

    let { drinkName } = req.params;

    axios.get( `${URL}/1/search.php?s=${drinkName}` )
        .then( ( results ) => {
            if ( results.data.drinks == undefined ) {
                res.status( 404 )
                    .send( {
                        message: 'THE RUM IS GONE!'
                    } )
            } else {
                res.send( {
                    drink: results.data.drinks
                } )
            }
        } )
        .catch( ( err ) => {
            if ( err.status == undefined ) {
                res.status( 404 )
                    .send( {
                        message: 'OH NO! THE RUM IS GONE!',
                        error: err
                    } )
            } else {
                res.status( 500 )
                    .send( {
                        message: 'Oops! Server Error. Try again later',
                        error: err
                    } )
            }
        } )
}

//GET user favs
exports.getUserFavoritesById = ( req, res ) => {
    let { userId } = req.params;

    const query = `
        SELECT drinkId
        FROM cocktails.favorite
        WHERE userId = ?;`

    const placeholders = [ userId ];

    db.query( query, placeholders, ( err, results ) => {
        console.log( results )
        if ( err ) {
            res.status( 500 )
                .send( {
                    message: 'There was a server error',
                    error: err
                } );
        } else if ( results.length == 0 ) {
            res.status( 404 )
                .send( {
                    message: 'No url found at that route',
                    error: err
                } )
        } else {
            console.log( results[ 0 ].drinkId )

            let ids = results.map( r => r.drinkId );

            getFullDrinkDataFromIds( ids, res, ( drinks ) => {
                res.send( { drinks } )
            } );
        }
    } );
}


exports.getRandomDrink = ( req, res ) => {

    axios.get( `${URL}/1/random.php` )
        .then( ( results ) => {
            console.log( results.data.drinks )
            if ( results.data.drinks == undefined ) {
                res.status( 404 )
                    .send( {
                        message: 'THE RUM IS GONE!'
                    } )
            } else {
                res.send( {
                    drink: results.data.drinks
                } )
            }
        } )
        .catch( ( err ) => {
            if ( err.status == undefined ) {
                res.status( 404 )
                    .send( {
                        message: 'OH NO! THE RUM IS GONE!',
                        error: err
                    } )
            } else {
                res.status( 500 )
                    .send( {
                        message: 'Oops! Server Error. Try again later',
                        error: err
                    } )
            }
        } )
}

exports.getTenRandomDrinks = ( req, res ) => {

    axios.get( `${URL}/1/random.php` )
        .then( results => {
            console.log( results.data.drinks )
            let ids = results.data.drinks.map( d => axios.get( `http://www.thecocktaildb.com/api/json/v1/1/random.php?i=${d.idDrink}` ) )
            Promise.all( ids )
                .then( ( values ) => {
                    // values is all http responses -> data is the data from each response
                    // data.drinks is the payload we actually want
                    // map -> get rid of all the filler junk data we dont care about
                    // flatten -> [[1], [2], [[3, 4], [[5]]]] => [1, 2, 3, 4, 5]
                    let drinks = values.map( v => v.data.drinks )
                    drinks = drinks.flat()
                    filterByExtraIngredient( drinks, ingredient, res );
                } )
                .catch( err => {
                    res.status( 500 )
                        .send( { message: 'error getting drinks' } )
                } )
        } )
        .catch( ( err ) => {
            if ( err.status == undefined ) {
                res.status( 404 )
                    .send( {
                        message: 'OH NO! THE RUM IS GONE!',
                        error: err
                    } )
            } else {
                res.status( 500 )
                    .send( {
                        message: 'Oops! Server Error. Try again later',
                        error: err
                    } )
            }
        } )
}

exports.getDrinkByOneIngredient = ( req, res ) => {

    let { ingredient1 } = req.params;

    axios.get( `${URL}/1/filter.php?i=${ingredient1}` )
        .then( ( results ) => {
            if ( results.data.drinks == undefined ) {
                res.status( 404 )
                    .send( {
                        message: 'Hmm... no drinks with that ingredient.'
                    } )
            } else {
                res.send( {
                    drink: results.data.drinks
                } )
            }
        } )
        .catch( ( err ) => {
            if ( err.status == undefined ) {
                res.status( 404 )
                    .send( {
                        message: 'Yikes! Seems like there is not a cocktail that meets your request ',
                        error: err
                    } )
            } else {
                res.status( 500 )
                    .send( {
                        message: 'Oops! Server Error. Try again later',
                        error: err
                    } )
            }
        } )
}


exports.getDrinksByTwoIngredients = ( req, res ) => {
    // res.send( "function not implemented yet" )
    // return;
    let { spirit, ingredient } = req.params;
    axios.get( `${URL}/1/filter.php?i=${spirit}` )
        .then( results => {
            let ids = results.data.drinks.map( d => axios.get( `http://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${d.idDrink}` ) )
            Promise.all( ids )
                .then( ( values ) => {
                    // values is all http responses -> data is the data from each response
                    // data.drinks is the payload we actually want
                    // map -> get rid of all the filler junk data we dont care about
                    // flatten -> [[1], [2], [[3, 4], [[5]]]] => [1, 2, 3, 4, 5]
                    let drinks = values.map( v => v.data.drinks )
                    drinks = drinks.flat()

                    filterByExtraIngredient( drinks, ingredient, res );
                } )
                .catch( err => {
                    res.status( 500 )
                        .send( { message: 'error getting drinks' } )
                } )
        } )
        .catch( ( err ) => {
            if ( err.status == undefined ) {
                res.status( 404 )
                    .send( {
                        message: 'Yikes! Seems like there is not a cocktail that meets your request ',
                        error: err
                    } )
            } else {
                res.status( 500 )
                    .send( {
                        message: 'Oops! Server Error. Try again later',
                        error: err
                    } )
            }
        } )
}

/**
 * 
 * @param {string[]} ids an array of ids as strings
 * @param {(drinks) => any} cb a callback function -> the flattened array of drinks is its param
 */
const getFullDrinkDataFromIds = async ( ids, res, cb ) => {

    ids = ids.map( id => axios.get( `http://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}` ) );

    Promise.all( ids )
        .then( ( values ) => {
            // values is all http responses -> data is the data from each response
            // data.drinks is the payload we actually want
            // map -> get rid of all the filler junk data we dont care about
            // flatten -> [[1], [2], [[3, 4], [[5]]]] => [1, 2, 3, 4, 5]
            let drinks = values.map( v => v.data.drinks )
            drinks = drinks.flat();

            // then do something
            cb( drinks );
        } )
        .catch( err => {
            res.status( 500 )
                .send( { message: 'big fat error getting drinks' } )
        } );

}

function filterByExtraIngredient ( drinkArr, ingredient, res ) {
    const filteredDrinks = drinkArr.filter( ( drink ) => checkIfDrinkHasIngredient( drink, ingredient ) )

    if ( filteredDrinks.length == 0 ) {
        res.status( 404 )
            .send( {
                message: "Too creative! We don't have any drinks with those two ingredients."
            } )
    } else {
        res.send(
            {
                drinks: filteredDrinks
            } )
    }
}

function checkIfDrinkHasIngredient ( drink, ingredient ) {
    // search all ingredents to see if any of them match the given ingredient
    for ( let i = 1; i < 16; i++ ) {
        
        // if there is another ingredient, check it, 
        //   else (undefinded), do not check it. That would be an error
        let _ingredent = drink[ "strIngredient" + [ i ] ]
        if (!_ingredent){
            return false
        }     
         
        if ( hasSubstringCaseInsensitive( _ingredent, ingredient ) ) {
            return true;
        }
    }
    return false;
}

/**
 * 
 * @param {string} longString 
 * @param {string} subString 
 */
function hasSubstringCaseInsensitive ( longString, subString ) {
    
    longString = longString.toLowerCase()
        .replaceAll( ' ', '' )
        .replaceAll( '-', '' )
        .replaceAll( "'", '' );

    subString = subString.toLowerCase()
        .replaceAll( ' ', '' )
        .replaceAll( '-', '' )
        .replaceAll( "'", '' );
        
    return longString.includes( subString )
}

exports.getUserReviewByDrinkId = ( req, res ) => {
    let { drinkId } = req.params;

    const query = `
        SELECT rating, comment
        FROM cocktails.review
        WHERE drinkId = ?;`

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
                    message: 'No review found at that route',
                    error: err
                } );
        } else {
            res.send( {
                message: "Here are your results",
                results: results,
            } )
        }
    }
    )
}

