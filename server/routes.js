const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');

const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect();

// **********************************
//         BASIC ROUTES
// **********************************

// Route 1 (handler)
async function hello(req, res) {
}


// Route 2 (handler)
async function jersey(req, res) {
}

// **********************************
//        GENERAL ROUTES
// **********************************

// Route 3 (handler)
async function all_matches(req, res) {
}

// Route 4 (handler)
async function all_players(req, res) {
}

// ********************************************
//             MATCH ROUTE
// ********************************************

// Route 5 (handler)
async function match(req, res) {
}

// ********************************************
//            PLAYER ROUTE
// ********************************************

// Route 6 (handler)
async function player(req, res) {
}

// ********************************************
//             SEARCH ROUTES
// ********************************************

// Route 7 (handler)
async function search_matches(req, res) {
}

// Route 8 (handler)
async function search_players(req, res) {
}

module.exports = {
    hello,
    jersey,
    all_matches,
    all_players,
    match,
    player,
    search_matches,
    search_players
}