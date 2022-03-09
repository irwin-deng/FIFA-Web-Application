const express = require('express');
const mysql      = require('mysql');
var cors = require('cors')


const routes = require('./routes')
const config = require('./config.json')

const app = express();

// disable CORS
app.use(cors());

// Route 1 - register as GET 
app.get('/hello', routes.hello)

// Route 2 - register as GET 
app.get('/jersey/:choice', routes.jersey)

// Route 3 - register as GET 
app.get('/matches/:league', routes.all_matches)

// Route 4 - register as GET 
app.get('/players', routes.all_players)

// Route 5 - register as GET 
app.get('/match', routes.match)

// Route 6 - register as GET 
app.get('/player', routes.player)

// Route 7 - register as GET 
app.get('/search/matches', routes.search_matches)

// Route 8 - register as GET 
app.get('/search/players', routes.search_players)



const port = process.env.PORT || config.server_port

app.listen(port, () => {
    console.log(`Server running at http://${config.server_host}:${port}/`);
});

module.exports = app;
