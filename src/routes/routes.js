var express = require('express');
var router = express.Router();
var fs = require('fs');
var databaseName = "pokemon"

/*
This builds the Neo4j Requirements to talk to the Database. 
*/
var neo4j = require('neo4j-driver');

var driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('webapp', 'qwer1234')
)

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
        var bannerIMG = "./public/pictures/testBanner.png"
        var model = {
            
        }
    }
)

/*
router.route("/Test").get(
    function(req,res){
        var session = driver.session()

        const resultPromise = session.writeTransaction(tx =>
            tx.run(
                'CREATE (a:Greeting) SET a.message = $message RETURN a.message + ", from node " + id(a)',
                { message: 'Hello, world'}
            )
        )

        resultPromise.then(result => {
            session.close()

            const singleRecord = result.records[0]
            const greeting = singleRecord.get(0)

            console.log(greeting)
            driver.close()
        })
    }
)

router.route("/clearDB").get(
    function(req,res){
        var session = driver.session()

        const resultPromise = session.writeTransaction(tx =>
            tx.run(
             'MATCH (n) optional match (n)-[r]-() DELETE n,r'   
            )
        )

        resultPromise.then(result => {
            session.close()

            var clearMessage = 'The DB is now cleared, the property keys remain';
            console.log(clearMessage);
            driver.close()
        })
    }
)

router.route("/loadPokemon").get(
    function(req,res){
        var session = driver.session()
        var firstTen = JSON.parse(fs.readFileSync("./src/jsonData/pokemon.json", "utf8"));
        //console.log(firstTen);
        var limit = 1;
        var createString = "";
        for(var i = 0; i < limit; i++){
            var pokemon = firstTen[i];
            var createString = createString + "CREATE (" + pokemon.name + " " +
             JSON.stringify(firstTen[i]) + ")";
           // console.log(createString);
        }
  
        const resultPromise = session.writeTransaction( tx => 
            tx.run(
                createString
            )
        )

        resultPromise.then(result => {
            session.close()
            const recordsAdded = result.records;
            var loadTenMessage = "the following was added to the DB ";
            for (var i = 0; i < recordsAdded.length(); i++){
                console.log(loadTenMessage + recordsAdded[i]);
            }
            driver.close()
        })

    }
)

Making Routes to load my data and get it ready to go
router.route("/loadData").get(
    function(req,res){
        var pokemonData = JSON.parse(fs.readFileSync(".src/jsonData/pokemonData", "YTF8"));

        (async function)
    }
)

*/

module.exports = router;