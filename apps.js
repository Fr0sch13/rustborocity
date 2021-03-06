var express = require('express');

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var router = require('./src/routes/routes');
app.get('/', router);
app.get('/about', router);
app.get('/pokemonPicker', router);
app.get('/updates', router);
app.get('/secret', router);
app.post('/battle', router);


function getNav(user) {
  
    return [
      {
        "name": "Home",
        "href": "/"
      },      
      {
        "name": "About",
        "href": "/about"
      },
      {
        "name": "Pokemon Picker",
        "href": "/pokemonPicker"
      },
      {
        "name": "Updates",
        "href": "/updates"
      }
    ];
  }
  
app.set("getNav", getNav);

app.use(express.static(__dirname + "/public"));

app.set('views', './src/views');
app.set('view engine', 'pug');

app.listen(3000, function(){
    console.log("Express Listening on Port 3000.");
});