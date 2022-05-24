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

exports.getDrinkByTwoIngredients = ( req, res ) => {
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

function filterByExtraIngredient ( drinkArr, ingredient, res ) {
    const filteredDrinks = drinkArr.filter( ( drink ) => checkIfDrinkHasIngredient(drink, ingredient) )
    if (filteredDrinks.length == 0){
        res.status(404)
        .send({
            message: "Too creative! We don't have any drinks with those two ingredients."
        })
    } else{
        res.send(
            {
                drinks: filteredDrinks
            } )
        }
}

function checkIfDrinkHasIngredient(drink, ingredient) {
    // search all ingredents to see if any of them match the given ingredient
    for (let i = 0; i < 16; i++){
        if (drink["strIngredient" + [i]] == ingredient){
            return true;
        } 
    }
}