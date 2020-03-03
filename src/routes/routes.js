var express = require('express');
var router = express.Router();
var fs = require('fs');
var databaseName = "Pokemon"
const request = require('request');
/*
This builds the Neo4j Requirements to talk to the Database. 
*/
var neo4j = require('neo4j-driver');

var driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('webapp', 'qwer1234')
);

/*
/ route is landing page
*/
var menuOptions = [
    {
        name: "Home",
        href: "/home"
    },
    {
        name: "I Choose You",
        href: "/pokemonPicker"
    },    
    {
        name: "About",
        href: "/about"
    },
    {
        name: "Updates",
        href: "/updates"
    }

];

router.route("/").get(
    function(req,res){
        (async function getData(){
            try{
                var name = "Bulbasaur"
                var query = "Match (n:Pokemon {name:\"" + name + "\"}) Return (n) LIMIT 1";
                var pokemonSpriteURL = "https://pokeapi.co/api/v2/" + name + "/";
                var testCount = await hitThatDB(query);
                var data = await getSprite(pokemonSpriteURL);
                console.log(data + "\n");
                console.log(testCount.name + " in slash");
            }
            catch(err){
                console.log(err);
            }
        }());
    }
);

// router.route("/").get(
//     function(req,res){

//         var bannerIMG = "";
        
//         var bodyData = {
//             "img" : bannerIMG,
//             "paragraph" : "Sample Paragraph"
//         };
//         var getNav = req.app.get("getNav");
//         var model = {
//             menuOptions: getNav(),
//             bodyData: bodyData
//         }
//         res.render("landing", model);
//     }
// )

async function getSprite(URL) {

};

async function hitThatDB(query){
    const session = driver.session();
    var returnObject = "";
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