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
                var name = "Basculin";
                var query = "Match (p:Pokemon {name:\"" + name + "\"})Return p";
                var getMon = await hitThatDB(query);
                
                var query2 = "Match (p:Pokemon {name:\"" + name + "\"}) Match (p)-[r]-(t) Return p, r, t";
                var getRelations = await hitThatDbForRelations(query2);
         
                var dexNum = getMon.pokemon_id;
                var pokemonSpriteURL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + dexNum + ".png";

                console.log(pokemonSpriteURL + "\n");
                console.log(getMon.name + " in slash");

                var sprite = pokemonSpriteURL;
                var abilities = getMon.abilities.split("', ");
                var abilityString = await abilityStringMaker(abilities);
            }
            catch(err){
                console.log(err);
            }
            finally{

                var bodyData = {
                    "img" : sprite,
                    "relations" : getRelations,
                    "ability" : abilityString,
                    "paragraph" : getMon
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

async function hitThatDbForRelations(query){
    const session = driver.session();
    var returnObject = [];
    return new Promise(resolve => {
        session.run(query)
        .then(result => {
            for(var i = 0; i < result.records.length; i++){
                var key = result.records[i]._fields[1].type + "_" +i;
                    if(result.records[i]._fields[2].properties.name) {
                        var val = result.records[i]._fields[2].properties.name;
                    };
                    if(result.records[i]._fields[2].properties.gen) {
                        var val = result.records[i]._fields[2].properties.gen;
                    };
                    if(result.records[i]._fields[2].properties.legendary){
                        if(result.records[i]._fields[2].properties.legendary == 0){
                            var val = "Not Legendary";
                        }
                        else {
                            var val = "Legendary";  
                        }
                    };
                returnObject.push({[key]:val});
            };
        })
        .catch(e => {
            console.log(e + " WE MESSED UP!!!!")
        })
        .then(() => {
            session.close();
            console.log(returnObject);
            resolve(returnObject);
        })
    })
};


async function abilityStringMaker(string){
    var abilityString = string.join("");
    abilityString = abilityString.slice(2, -2);
    abilityString = abilityString.split("'");
    abilityString = abilityString.join(", ");
    return abilityString;
};

module.exports = router;