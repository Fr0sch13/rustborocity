var express = require('express');
var router = express.Router();
var fs = require('fs');
var databaseName = "test"

/*
This builds the Neo4j Requirements to talk to the Database. 
*/
var neo4j = require('neo4j-driver');

var driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('webapp', 'qwer1234')
)

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

/*
Making Routes to load my data and get it ready to go
router.route("/loadData").get(
    function(req,res){
        var pokemonData = JSON.parse(fs.readFileSync(".src/jsonData/pokemonData", "YTF8"));

        (async function)
    }
)


router.route("/csvConvert").get(
    function(req,res){
        var pokemonData = 
    }
)
*/
module.exports = router;