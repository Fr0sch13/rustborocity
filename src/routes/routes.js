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
                var paragraph = [{"text" :"Welcome to Rustboro City!"}, {"text" :"We are known as the Metropolis in western Hoenn. Home to the Devon Corp. and our Rock Type Specialist Gym Leader Roxanne!"}, {"text" :"Walking down the streets of Rustboro you will feel like you are in an old town, but honestly it is anything but!"},{"text":"Our cities slogan is: \“The city probing the integration of nature and science.\” "},{"text":"If you are feeling behind on anything trainer related you can always sit in on a class at the Pokemon Trainer’s School! Where the best little minds are learning how to be better in hopes to be the next generation of trainers, breeders, and maybe the next Pokemon League Champion!"}];
            }
            catch(err){
                console.log(err);
            }
            finally{
                var getNav = req.app.get("getNav");
                var model = {
                    menuOptions : getNav(),
                    landingData : paragraph
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
                var paragraph = [{"text" : "While on a stroll down to the Pokemon Trainer’s School, Professor Dalton and Profesora Andrea noticed the PokeNav was on all the trainer’s desk."}, {"text" : "Profesora Andrea: The PokeNav is really something amazing! That old man Mr. Stone did a good thing!"},{"text": "Professor Dalton looks at Profesora Andrea."},{"text": "Professor Dalton: It's weird they are still memorizing all the data about Pokemon when it can be stored and looked up easily on the PokeNav just like the other applications it supports."}, {"text": "Professor Dalton paused, he looked at Profesora Andrea and ran out the door to the Devon Corporation."}, {"text": "Profesora Andrea: HAHAHAHA"}, {"text": "Professor Dalton was out of breath as he gave his pitch to the President of Devon Corporation."}, {"text": "Mr. Stone: Since my youth, I've immersed myself in work. Consequently, I'm not familiar with trends and that sort of thing. We must make that happen at once!"},{"text": "We hope everyone who uses this application is as excited as Professor Dalton was when he thought of this."}];   
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

router.route("/updates").get(
    function(req,res){
        (async function getData(){
            try{
                var paragraph = [{"text" : "Rustboro City is a work in the making. Here is the list of things we are hoping to add to this application."}, {"text":"We are looking to add Machine Learning to the Pokemon Picker so you can have a strong idea on if you will win your next battle."},{"text":"We will be adding move lists for Pokemon, Including Egg Moves, TM Lists, and Pokemon Move Effectiveness."}, {"text": "We are looking to include a trainer network.This will include: Trainer Accounts, Trainer Pokedex, Trainer Teams, Trainer Badge Cases, Trainer Z-Crystal Bag, and Trainer Technical Machine Tracker."}, {"text": "We will add the Pokemon Newly Discovered in the Galar Region."}, {"text": "We are going to add Dynamax, Gigantamax, Mega, and other special evolutions to the Pokemon Database."}, {"text": "We will be also adding features around Pokemon Go! Including all the base of the Original Rustboro City. As well as Pokemon Go specific features! Like Go Rocket Information, Pogo Stop Information, Gym Finder, New Locations, and a Buddy Book so you can track all of your best buddies."}, {"text": "So expect more from us here at Rustboro City and check back here for all the new stuff we are working on for you!"}];
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
                res.render("updates", model);
            }
        }());  
    }
);

router.route("/pokemonPicker").get(
    function(req,res){
        var getNav = req.app.get("getNav");
        var model = {
            menuOptions : getNav(),
        }
        res.render("picker", model);
    }
);

router.route("/battle").post(
    function(req,res){
        console.log(req.body);
        (async function getData(){
            try{
                var name = req.body.name;
                var query = "Match (p:Pokemon {name:\"" + name + "\"})Return p";
                var getMon = await hitThatDB(query);

                var name2 = req.body.name2;
                var query2 = "Match (p:Pokemon {name:\"" + name2 + "\"})Return p";
                var getMon2 = await hitThatDB(query2);
                
                var query3 = "Match (p:Pokemon {name:\"" + name + "\"}) Match (p)-[r]-(t) Return p, r, t";
                var getRelations = await hitThatDbForRelations(query3);

                var query4 = "Match (p:Pokemon {name:\"" + name2 + "\"}) Match (p)-[r]-(t) Return p, r, t";
                var getRelations2 = await hitThatDbForRelations(query4);
         
                var dexNum = getMon.pokemon_id;
                var dexNum2 = getMon2.pokemon_id;
                
                var pokemonSpriteURL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + dexNum + ".png";
                var pokemonSpriteURL2 = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + dexNum2 + ".png";


                console.log(pokemonSpriteURL + "\n");
                console.log(pokemonSpriteURL2 + "\n");

                console.log(getMon.name + " in slash");
                console.log(getMon2.name + " in slash");
                
                var abilities = getMon.abilities.split("', ");
                var abilityString = await abilityStringMaker(abilities);
                
                var mon2abilities = getMon2.abilities.split("', ");
                var mon2abilityString = await abilityStringMaker(mon2abilities);

                if(getRelations.relations.length > 3) {
                    var type1 = "https://www.serebii.net/pokedex-bw/type/" + getRelations.relations[0].HAS_A_TYPE_OF_0 + ".gif";
                    var type2 = "https://www.serebii.net/pokedex-bw/type/" + getRelations.relations[1].HAS_A_TYPE_OF_1 + ".gif";
                    if(getRelations.relations[2].IS_FROM){
                        var generation = getRelations.relations[2].IS_FROM;
                        var legendary = getRelations.relations[3].LEGENDARY_STATUS;
                    }
                    else{
                        var legendary = getRelations.relations[2].LEGENDARY_STATUS;
                        var generation = getRelations.relations[3].IS_FROM;
                    }
                }
                else{
                    var type1 = "https://www.serebii.net/pokedex-bw/type/" + getRelations.relations[0].HAS_A_TYPE_OF_0 + ".gif";
                    if(getRelations.relations[1].IS_FROM){
                        var generation = getRelations.relations[1].IS_FROM;
                        var legendary = getRelations.relations[2].LEGENDARY_STATUS;
                    }
                    else{
                        var legendary = getRelations.relations[1].LEGENDARY_STATUS;
                        var generation = getRelations.relations[2].IS_FROM;
                    }
                }
                console.log("Pokemon 1 is loaded");
                console.log(type1, + " " + type2, + " " + legendary, + " " + generation);

                if(getRelations2.relations.length > 3) {
                    var mon2type1 = "https://www.serebii.net/pokedex-bw/type/" + getRelations2.relations[0].HAS_A_TYPE_OF_0 + ".gif";
                    var mon2type2 = "https://www.serebii.net/pokedex-bw/type/" + getRelations2.relations[1].HAS_A_TYPE_OF_1 + ".gif";
                    if(getRelations2.relations[2].IS_FROM){
                        var mon2generation = getRelations2.relations[2].IS_FROM;
                        var mon2legendary = getRelations2.relations[3].LEGENDARY_STATUS;
                    }
                    else{
                        var mon2legendary = getRelations2.relations[2].LEGENDARY_STATUS;
                        var mon2generation = getRelations2.relations[3].IS_FROM;
                    }
                }
                else{
                    var mon2type1 = "https://www.serebii.net/pokedex-bw/type/" + getRelations2.relations[0].HAS_A_TYPE_OF_0 + ".gif";
                    if(getRelations2.relations[1].IS_FROM){
                        var mon2generation = getRelations2.relations[1].IS_FROM;
                        var mon2legendary = getRelations2.relations[2].LEGENDARY_STATUS;
                    }
                    else{
                        var mon2legendary = getRelations2.relations[1].LEGENDARY_STATUS;
                        var mon2generation = getRelations2.relations[2].IS_FROM;
                    }
                }
                console.log("Pokemon 2 is loaded!");
                console.log(mon2type1, + " " + mon2type2, + " " + mon2legendary, + " " + mon2generation);
            }
            catch(err){
                console.log(err);
            }
            finally{

                var bodyData = {
                    "img" : pokemonSpriteURL,
                    "type1" : type1,
                    "type2" : type2,
                    "legendary" : legendary,
                    "generation" : generation,
                    "ability" : abilityString,
                    "paragraph" : getMon,                    
                    "mon2img" : pokemonSpriteURL2,
                    "mon2type1" : mon2type1,
                    "mon2type2" : mon2type2,
                    "mon2legendary" : mon2legendary,
                    "mon2generation" : mon2generation,
                    "mon2ability" : mon2abilityString,
                    "mon2paragraph" : getMon2
                };
                var getNav = req.app.get("getNav");
                var model = {
                    menuOptions: getNav(),
                    bodyData: bodyData
                }
                res.render("battle", model);
            }
        }());
    }
);

/*
This was a route to test pokemon retrevial from the DB
*/
router.route("/secret").get(
    function(req,res){
        (async function getData(){
            try{
                var name = "Marill";
                var query = "Match (p:Pokemon {name:\"" + name + "\"})Return p";
                var getMon = await hitThatDB(query);
                
                var query2 = "Match (p:Pokemon {name:\"" + name + "\"}) Match (p)-[r]-(t) Return p, r, t";
                var getRelations = await hitThatDbForRelations(query2);
         
                var dexNum = getMon.pokemon_id;
                var pokemonSpriteURL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + dexNum + ".png";

                console.log(pokemonSpriteURL + "\n");
                console.log(getMon.name + " in slash");

                var sprite = pokemonSpriteURL;
                if(getRelations.relations.length > 2) {
                    var type1 = "https://www.serebii.net/pokedex-bw/type/" + getRelations.relations[0].HAS_A_TYPE_OF_0 + ".gif";
                    var type2 = "https://www.serebii.net/pokedex-bw/type/" + getRelations.relations[1].HAS_A_TYPE_OF_1 + ".gif";
                    if(getRelations.relations[2].IS_FROM){
                        var generation = getRelations.relations[2].IS_FROM;
                        var legendary = getRelations.relations[3].LEGENDARY_STATUS;
                    }
                    else{
                        var legendary = getRelations.relations[2].LEGENDARY_STATUS;
                        var generation = getRelations.relations[3].IS_FROM;
                    }
                }
                else{
                    var type1 = "https://www.serebii.net/pokedex-bw/type/" + getRelations.relations[0].HAS_A_TYPE_OF_0 + ".gif";
                    if(getRelations.relations[1].IS_FROM){
                        var generation = getRelations.relations[1].IS_FROM;
                        var legendary = getRelations.relations[2].LEGENDARY_STATUS;
                    }
                    else{
                        var legendary = getRelations.relations[1].LEGENDARY_STATUS;
                        var generation = getRelations.relations[2].IS_FROM;
                    }
                }
                console.log(type1, + " " + type2, + " " + legendary, + " " + generation);
                var abilities = getMon.abilities.split("', ");
                var abilityString = await abilityStringMaker(abilities);
            }
            catch(err){
                console.log(err);
            }
            finally{

                var bodyData = {
                    "img" : sprite,
                    "type1" : type1,
                    "type2" : type2,
                    "legendary" : legendary,
                    "generation" : generation,
                    "ability" : abilityString,
                    "paragraph" : getMon
                };
                var getNav = req.app.get("getNav");
                var model = {
                    menuOptions: getNav(),
                    bodyData: bodyData
                }
                res.render("secret", model);
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

/*
Reusable Function for getting all pokemon Data from nodes and relations
*/
async function hitThatDbForRelations(query){
    const session = driver.session();
    var returnObject = {"relations":[]};
    return new Promise(resolve => {
        session.run(query)
        .then(result => {
            for(var i = 0; i < result.records.length; i++){
                var key;
                var val;
                if(result.records[i]._fields[1].type === "HAS_A_TYPE_OF"){
                    key = result.records[i]._fields[1].type + "_" + i;
                }
                else{
                    key = result.records[i]._fields[1].type;
                }

                    if(result.records[i]._fields[2].properties.name) {
                        val = result.records[i]._fields[2].properties.name;
                    };
                    if(result.records[i]._fields[2].properties.gen) {
                        val = result.records[i]._fields[2].properties.gen;
                    };
                    if(result.records[i]._fields[2].properties.legendary){
                        if(result.records[i]._fields[2].properties.legendary == 0){
                            val = "Not Legendary";
                        }
                        else {
                            val = "Legendary";  
                        }
                    };
                returnObject.relations.push({[key]:val});
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