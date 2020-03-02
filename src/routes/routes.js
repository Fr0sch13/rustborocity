var express = require('express');
var router = express.Router();
var fs = require('fs');
var databaseName = "Pokemon"

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



// router.route("/").get(
//     function(req,res){
//        var bannerIMG = 'public\pictures\testBanner.jpeg'
//         // var bannerIMG = 'https://fiverr-res.cloudinary.com/image/upload/t_message_attachment_large_thumb,q_auto,f_auto/v1/secured-attachments/message/attachments/03a078fd0b75d3d0216b78140bef690c-1582513677420/rustboroCity_logo_idea.png?__cld_token__=exp=1582853171~hmac=801cb1892d5cbdcfbb4f13e1fc61df373ca0e71408cc703354373220cf938dd9'
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

router.route("/").get(
    function(req,res){
        (async function getData(){
            try{
                var name = "Bulbasaur"
                var query = "Match (n:Pokemon {name:\"" + name + "\"}) Return (n) LIMIT 1"
                var testCount = await hitThatDB(query);
                console.log(testCount.name + " in slash");
            }
            catch(err){
                console.log(err);
            }
        }());
    }
);


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
    
    // return returnObject
};

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