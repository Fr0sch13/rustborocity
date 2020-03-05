var express = require('express');
var router = express.Router();
/*
This builds the Neo4j Requirements to talk to the Database. 
*/
var neo4j = require('neo4j-driver');

var driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('webapp', 'qwer1234')
);

/*
This is the Landing Page
*/
router.route("/").get(
    function(req,res){
        (async function getData(){
            try{
                var query = "Match (n:siteData {name:\"landing\"}) Return (n) LIMIT 1";
                var paragraph = await hitThatDB(query);

            }
            catch(err){
                console.log(err);
            }
            finally{
                var getNav = req.app.get("getNav");
                var model = {
                    menuOptions: getNav(),
                    laningData : paragraph
                }
                res.render("landing", model);
            }
        }());
    }
);

/*
This is the about page
*/
router.route("/about").get(
    function(req,res){
        (async function getData(){
            try{
                var query = "Match (n:siteData {name:\"about\"}) Return (n) LIMIT 1";
                var paragraph = await hitThatDB(query);
                
            }
            catch(err){
                console.log(err);
            }
            finally{

                var getNav = req.app.get("getNav");
                var model = {
                    menuOptions: getNav(),
                    aboutData: paragraph
                }
                res.render("about", model);
            }
        }());
    }
);

/*
This was a route to test pokemon retrevial from the DB
*/
router.route("/pokemon").get(
    function(req,res){
        (async function getData(){
            try{
                var name = "Pikachu";
                var query = "Match (n:Pokemon {name:\"" + name + "\"}) Return (n) LIMIT 1";
                var getMon = await hitThatDB(query);
                var dexNum = getMon.pokemon_id;
                var pokemonSpriteURL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + dexNum + ".png";

                console.log(pokemonSpriteURL + "\n");
                console.log(getMon.name + " in slash");
            }
            catch(err){
                console.log(err);
            }
            finally{
                var bannerIMG = pokemonSpriteURL;
        
                var bodyData = {
                    "img" : bannerIMG,
                    "paragraph" : "Sample Paragraph"
                };
                var getNav = req.app.get("getNav");
                var model = {
                    menuOptions: getNav(),
                    bodyData: bodyData
                }
                res.render("pokemon", model);
            }
        }());
    }
);

/*
This is my reusable function to query the database
*/
async function hitThatDB(query){
    const session = driver.session();
    var returnObject;
    return new Promise(resolve => {
        session.run(query)
        .then(result => {
            returnObject = result.records[0]._fields[0].properties;
            console.log(returnObject);
        })
        .catch(e => {
            console.log(e + " WE MESSED UP!!!!")
        })
        .then(() => {
            session.close();
            resolve(returnObject);
        }) 
    })
};


module.exports = router;