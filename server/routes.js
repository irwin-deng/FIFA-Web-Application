const config = require('./config.json');
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
    if (req.query.name) {
        res.send(`Hello, ${req.query.name}! Welcome to the FIFA server!`)
    } else {
        res.send(`Hello! Welcome to the FIFA server!`)
    }
}


// Route 2 (handler)
async function jersey(req, res) {
    const colors = ['red', 'blue', 'white']
    const jersey_number = Math.floor(Math.random() * 20) + 1
    const name = req.query.name ? req.query.name : "player"

    if (req.params.choice === 'number') {
        res.json({ message: `Hello, ${name}!`, jersey_number: jersey_number })
    } else if (req.params.choice === 'color') {
        var lucky_color_index = Math.floor(Math.random() * 2);
        res.json({ message: `Hello, ${name}!`, jersey_color: colors[lucky_color_index] })
    } else {
        res.json({ message: `Hello, ${name}, we like your jersey!` })
    }
}

// **********************************
//        GENERAL ROUTES
// **********************************

// Route 3 (handler)
async function all_matches(req, res) {
    const league = req.params.league ? req.params.league : 'D1'

    if (req.query.page && !isNaN(req.query.page)) {
        // This is the case where page is defined.
        const pagesize = req.query.pagesize ? req.query.pagesize : 10
        const page = req.query.page

        connection.query(
            `SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals  
            FROM Matches 
            WHERE Division = '${league}'
            ORDER BY HomeTeam, AwayTeam`
            , function (error, results, fields) {
                if (error) {
                    console.log(error)
                    return res.json({ error: error })
                } else if (results) {
                    return res.json({ results: results.slice(pagesize * (page - 1), pagesize * page) })
                }
            });
    } else {
        connection.query(
            `SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals  
            FROM Matches 
            WHERE Division = '${league}'
            ORDER BY HomeTeam, AwayTeam`
            , function (error, results, fields) {
                if (error) {
                    console.log(error)
                    return res.json({ error: error })
                } else if (results) {
                    return res.json({ results: results })
                }
            });
    }
}

// Route 4 (handler)
async function all_players(req, res) {
    if (req.query.page && !isNaN(req.query.page)) {
        // This is the case where page is defined.
        const pagesize = req.query.pagesize ? req.query.pagesize : 10
        const page = req.query.page

        connection.query(
            `SELECT PlayerId, Name, Nationality, OverallRating as Rating, Potential, Club, Value  
            FROM Players
            ORDER BY Name`
            , function (error, results, fields) {
                if (error) {
                    console.log(error)
                    return res.json({ error: error })
                } else if (results) {
                    return res.json({ results: results.slice(pagesize * (page - 1), pagesize * page) })
                }
            });
    } else {
        connection.query(
            `SELECT PlayerId, Name, Nationality, OverallRating as Rating, Potential, Club, Value  
            FROM Players
            ORDER BY Name`
            , function (error, results, fields) {
                if (error) {
                    console.log(error)
                    return res.json({ error: error })
                } else if (results) {
                    return res.json({ results: results })
                }
            });
    }
}

// ********************************************
//             MATCH ROUTE
// ********************************************

// Route 5 (handler)
async function match(req, res) {
    if (!isNaN(req.query.id)) {
        connection.query(
            `SELECT MatchId, Date, Time, HomeTeam as Home, AwayTeam as Away, FullTimeGoalsH as HomeGoals,
                FullTimeGoalsA as AwayGoals, HalfTimeGoalsH as HTHomeGoals, HalfTimeGoalsA as HTAwayGoals,
                ShotsH as ShotsHome, ShotsA as ShotsAway, ShotsOnTargetH as ShotsOnTargetHome,
                ShotsOnTargetA as ShotsOnTargetAway, FoulsH as FoulsHome, FoulsA as FoulsAway,
                CornersH as CornersHome, CornersA as CornersAway, YellowCardsH as YCHome,
                YellowCardsA as YCAway, RedCardsH as RCHome, RedCardsA as RCAway
            FROM Matches
            WHERE MatchId = '${req.query.id}'`
            , function (error, results, fields) {
                if (error) {
                    console.log(error)
                    return res.json({ error: error })
                } else if (results) {
                    return res.json({ results: results })
                }
            });
    } else {
        return res.json({ results: [] })
    }
}

// ********************************************
//            PLAYER ROUTE
// ********************************************

// Route 6 (handler)
async function player(req, res) {
    if (!isNaN(req.query.id)) {
        connection.query(
            `SELECT BestPosition
            FROM Players
            WHERE PlayerId = '${req.query.id}'`
            , function (error, results, fields) {
                if (error) {
                    console.log(error)
                    return res.json({ error: error })
                } else if (results) {
                    const position = results[0].BestPosition
                    var querystring = ``
                    if (position === "GK") {
                        querystring = `SELECT PlayerId, Name, Age, Photo, Nationality, Flag, OverallRating as Rating, Potential, Club,
                                        ClubLogo, Value, Wage, InternationalReputation, Skill, JerseyNumber, ContractValidUntil, Height,
                                        Weight, BestPosition, BestOverallRating, ReleaseClause, GKPenalties, GKDiving, GKHandling, GKKicking,
                                        GKPositioning, GKReflexes
                                    FROM Players
                                    WHERE PlayerId = '${req.query.id}'`
                    } else {
                        querystring = `SELECT PlayerId, Name, Age, Photo, Nationality, Flag, OverallRating as Rating, Potential, Club,
                                        ClubLogo, Value, Wage, InternationalReputation, Skill, JerseyNumber, ContractValidUntil, Height,
                                        Weight, BestPosition, BestOverallRating, ReleaseClause, NPassing, NBallControl, NAdjustedAgility,
                                        NStamina, NStrength, NPositioning
                                    FROM Players
                                    WHERE PlayerId = '${req.query.id}'`
                    }

                    connection.query(
                        querystring
                        , function (error, results, fields) {
                            if (error) {
                                console.log(error)
                                return res.json({ error: error })
                            } else if (results) {
                                return res.json({ results: results })
                            }
                        });
                }
            });
    } else {
        return res.json({ results: [] })
    }
}

// ********************************************
//             SEARCH ROUTES
// ********************************************

// Route 7 (handler)
async function search_matches(req, res) {
    var constraints = ''
    const home = req.query.Home
    const away = req.query.Away

    if (!home && !away) {
        constraints = ''
    } else if (home && !away) {
        constraints = `WHERE HomeTeam LIKE '%${home}%'`
    } else if (!home && away) {
        constraints = `WHERE AwayTeam LIKE '%${away}%'`
    } else {
        constraints = `WHERE HomeTeam LIKE '%${home}%' AND AwayTeam LIKE '%${away}%'`
    }

    if (req.query.page && !isNaN(req.query.page)) {
        // This is the case where page is defined.
        const pagesize = req.query.pagesize ? req.query.pagesize : 10
        const page = req.query.page

        connection.query(
            `SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals  
             FROM Matches 
             ${constraints} 
             ORDER BY HomeTeam, AwayTeam`
            , function (error, results, fields) {
                if (error) {
                    console.log(error)
                    return res.json({ error: error })
                } else if (results) {
                    return res.json({ results: results.slice(pagesize * (page - 1), pagesize * page) })
                }
            });
    } else {
        connection.query(
            `SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals  
             FROM Matches 
             ${constraints}
             ORDER BY HomeTeam, AwayTeam`
            , function (error, results, fields) {
                if (error) {
                    console.log(error)
                    return res.json({ error: error })
                } else if (results) {
                    return res.json({ results: results })
                }
            });
    }
}

// Route 8 (handler)
async function search_players(req, res) {
    var constraints = 'WHERE'

    const RatingLow = req.query.RatingLow ? req.query.RatingLow : 0
    const RatingHigh = req.query.RatingHigh ? req.query.RatingHigh : 100
    constraints += ` OverallRating >= ${RatingLow} AND OverallRating <= ${RatingHigh}`

    const PotentialLow = req.query.PotentialLow ? req.query.PotentialLow : 0
    const PotentialHigh = req.query.PotentialHigh ? req.query.PotentialHigh : 100
    constraints += ` AND Potential >= ${PotentialLow} AND Potential <= ${PotentialHigh}`

    const Name = req.query.Name
    if (Name) {
        constraints += ` AND Name LIKE '%${Name}%'`
    }

    const Nationality = req.query.Nationality
    if (Nationality) {
        constraints += ` AND Nationality LIKE '%${Nationality}%'`
    }

    const Club = req.query.Club
    if (Club) {
        constraints += ` AND Club LIKE '%${Club}%'`
    }

    if (req.query.page && !isNaN(req.query.page)) {
        // This is the case where page is defined.
        const pagesize = req.query.pagesize ? req.query.pagesize : 10
        const page = req.query.page

        connection.query(
            `SELECT PlayerId, Name, Nationality, OverallRating as Rating, Potential, Club, Value
             FROM Players 
             ${constraints} 
             ORDER BY Name`
            , function (error, results, fields) {
                if (error) {
                    console.log(error)
                    return res.json({ error: error })
                } else if (results) {
                    return res.json({ results: results.slice(pagesize * (page - 1), pagesize * page) })
                }
            });
    } else {
        connection.query(
            `SELECT PlayerId, Name, Nationality, OverallRating as Rating, Potential, Club, Value
             FROM Players 
             ${constraints} 
             ORDER BY Name`
            , function (error, results, fields) {
                if (error) {
                    console.log(error)
                    return res.json({ error: error })
                } else if (results) {
                    return res.json({ results: results })
                }
            });
    }
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