var express = require('express');
var router = express.Router();
var fs = require('fs');
var databaseName = "test"

/*
This builds the Neo4j Requirements to talk to the Database. 
*/
var neo4j = require('neo4j-driver');

var driver = neo4j.driver(
    'neo4j://localhost',
    neo4j.auth.basic('neo4j', 'neo4j')
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
