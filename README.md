## Introduction

This web app was created for my CIS 550 (Databases) course. Languages used include mySQL (for querying a database), Node.js (for the backend), and React (for the frontend).

## File Descriptions

**/datasets**: This directory contains the two datasets used in this app. More info on the datasets can be found [here](./datasets/Dataset%20Information.md). These datasets are uploaded to a server and queried by the server-side app using MySQL.

**/client**: Holds the files for the [React Client](#React-Client "Goto React-Client")

- __package.json__: maintains the project dependency tree; defined project properties, scripts, etc.
- __/public__: Contains static files such as __index.html__ and assets like __robots.txt__ for specifying crawlability
- __/src__: Contains source code for the React app.
    - __config.json__: Holds server connection information
    - __fetcher.js__: Contains helper functions to wrap calls to API routes
    - __index.js__: The main JS entry point to the app and stores the main DOM render call in React. Page routing via components and imports for stylesheets are also contained in this file.
    - __/pages__: Contains files for the React components corresponding to the 3 pages in the application.
        - __HomePage.js__: The landing page, provides a brief overview of players and matches in the form of two paginated tables
        - __MatchesPage.js__: A page specifically for matches. Allows users to search for a specific match and view specific details for a selected match.
        - __PlayersPage.js__: A page specifically for players. Allows users to search and filter for players and provides a detailed view of the player with visualizations for selected selected.
    - __/components__: Contains files for the top navigation bar, which is reused across all 3 pages.

**/server**: Holds the files for the [Node API](#Node-API "Goto Node-API")
- __config.json__: Holds the RDS connection credentials/information and application configuration settings.
- __package.json__: Maintains the project dependency tree. Defined project properties, scripts, etc.
- __routes.json__: Contains the implementation of the API routes' handler functions.
- __server.js__: The code for the routed HTTP application. Imports __routes.js__ and maps each route function to an API route and type.
- __/tests__: Contains the test files for the API
    - __results.json__: Stores some expected results for the tests
    - __tests.js__: Stores tests


## React Client
Upon receiving a request from a client (your browser in this case), the application uses a routing library (react-router) that parses the URL string to map it to a registered route (see index.js), which, in turn, renders the React page component corresponding to that route.

### Home page (<https://fifa-app.irwin-deng.com/>)
This page displays a players table and a matches table. The columns of both tables can be sorted by clicking on the arrows next to the column name. You can navigate through the table by using the navigation menu at the bottom right of each table.

### Players page (<https://fifa-app.irwin-deng.com/players>)
At the top of the page, there are options to search for players by their name, nationality, and club. Additionally, there are options to filter players by their FIFA 21 ratings.

The table below displays a list of all players filtered by search criteria. You can navigate through the table by using the navigation menu at the bottom right of each table. Clicking on a player's name will provide a detailed view of the player and a visualization of their ratings.

### Matches page (<https://fifa-app.irwin-deng.com/matches>)
At the top of the page, there are options to search for matches by the home or away team.

The table below displays a list of all matches filtered by search criteria. The columns of the table can be sorted by clicking on the arrows next to the column name. You can navigate through the table by using the navigation menu at the bottom right of each table.


## Node API
This Node application uses MySQL to make calls to a database with the [two datasets](./datasets). The API can be accessed at <https://fifa-web-application.herokuapp.com>.

### Route specifications:

`/matches/:{league}`:
- __Description__: Returns an array of selected match attributes for a particular league sorted by home team first then the away team - both in alphabetical order
- __Route Parameter(s)__: `league` (string, one of {D1, SP1, F1, I1, E0})
- __Query Parameter(s)__: `page` (int, optional), `pagesize` (int, optional) (default: 10)
- __Route Handler__: `all_matches (req, res)`
- __Return Type__: JSON
- __Return Parameters__: {`results` (JSON array of { `MatchId` (int), `Date` (string), `Time` (string), `Home` (string), `Away` (string), `HomeGoals` (int), `AwayGoals` (int)}) }
- __Expected (Output) Behavior:__
    - Considers only the division specified by `league`
    - __Case 1__: If the page parameter (`page`) is defined
        - Returns match entries with all the above return parameters for that page number by considering the `page` and `pagesize` parameters. For example, page 1 and page 7 for a page size 10 should have entries 1 through 10 and 61 through 70 respectively
    - __Case 2:__ If the page parameter (`page`) is not defined
        - Returns all match entries with all the above return parameters. 

`/players`:
- __Description__: Returns an array of selected player attributes sorted by their names in alphabetical
order.
- __Route Parameter(s)__: _None_
- __Query Parameter(s)__: `page` (int, optional), `pagesize` (int, optional) (default: 10)
- __Route Handler__: `all_players(req, res)`
- __Return Type__: JSON
- __Return Parameters__: {`results` (JSON array of { `PlayerId` (int), `Name` (string), `Nationality` (string), `Rating` (int), `Potential` (int), `Club` (string), `Value` (string) }) }
- __Expected (Output) Behavior__:
    - __Case 1__: If the page parameter (`page`) is defined
        - Returns player entries with all the above return parameters for that page number by considering the `page` and `pagesize` parameters. For example, page 1 and page 7 for a page size 10 should have entries 1 through 10 and 61 through 70 respectively
    - __Case 2__: If the page parameter (`page`) is not defined
        - Returns all player entries with all the above return parameters

`/match`:
- __Description__: Returns an array of information about a match, specified by id.
- __Route Parameter(s)__: _None_
- __Query Parameter(s)__: `id` (int)
- __Route Handler__: `match(req, res)`
- __Return Type__: JSON
- __Return Parameters__: {`results` (JSON array of { `MatchId` (int), `Date` (string), `Time` (string), `Home` (string), `Away` (string), `HomeGoals` (int), `AwayGoals` (int), `HTHomeGoals` (int), `HTAwayGoals` (int), `ShotsHome` (int), `ShotsAway` (int), `ShotsOnTargetHome` (int), `ShotsOnTargetAway` (int), `FoulsHome` (int), `FoulsAway` (int), `CornersHome` (int), `CornersAway` (int), `YCHome` (int), `YCAway` (int), `RCHome` (int), `RCAway` (int)}) }
- __Expected (Output) Behavior__:
    - If the `id` is found, returns the singleton array of all the attributes available, but if the ID is a number but is not found, returns an empty array as `results` without causing an error

`/player`:
- __Description__: Returns information about a player, specified by id, depending on their best position
in the field
- __Route Parameter(s)__: _None_
- __Query Parameter(s)__: `id` (int)
- __Route Handler__: `player(req, res)`
- __Return Type__: JSON
- __Return Parameters__: {results (JSON array of { `PlayerId` (int), `Name` (string), `Age`(int), `Photo` (string), `Nationality` (string), `Flag` (string), `Rating` (int), `Potential` (int), `Club` (string), `ClubLogo` (string), `Value` (string), `Wage` (string), `InternationalReputation` (int), `Skill` (int), `JerseyNumber` (int), `ContractValidUntil` (String), `Height` (string), `Weight` (string), `BestPosition` (string), `BestOverallRating` (int), `ReleaseClause` (string) }) }
- __Expected (Output) Behavior__:
    - If the `id` is found return the singleton array of all the attributes available, but if the ID is a number but is not found, returns an empty array as `results` without causing an error
    - Additional return parameters will vary depending on the players’ `BestPosition`.
        - If the player’s `BestPosition` is ‘GK’, returns (in addition to the above required return parameters) the 6 goalkeeper specific rating attributes. These attributes are { `GKPenalties` (int), `GKDiving` (int), `GKHandling` (int), `GKKicking` (int), `GKPositioning` (string), `GKReflexes` (int) }
        - For all other players, returns the 6 ‘neutral’ player rating attributes (in addition to the above required return parameters). These are: { `NPassing` (int), `NBallControl` (int), `NAdjustedAgility` (int), `NStamina` (int), `NStrength` (string), `NPositioning` (int) }
    - Values like `ReleaseClause` might be NULL for some entries.

`/search/matches`:
- __Description__: Returns an array of selected attributes for matches that match the search query
- __Route Parameter(s)__: _None_
- __Query Parameter(s)__: `Home` (string, optional), `Away` (string, optional), `page` (int, optional), `pagesize` (int, optional) (default: 10)
- __Route Handler__: `search_matches(req, res)`
- __Return Type__: JSON
- __Return Parameters__: {`results` (JSON array of { `MatchId` (int), `Date` (string), `Time` (string), `Home` (string), `Away` (string), `HomeGoals` (int), `AwayGoals` (int)}) }
- __Expected (Output) Behavior__:
    - Returns an array with all matches that match the constraints. If no match satisfies the constraints, returns an empty array as `results` without causing an error
    - The matching behavior for string-matching is the same as that of the LIKE function in MySQL
    - __Case 1__: If the page parameter (`page`) is defined
        - Returns match entries with all the above return parameters for that page number by considering the `page` and `pagesize` parameters. For example, page 1 and page 7 for a page size 10 should have entries 1 through 10 and 61 through 70 respectively
    - __Case 2:__ If the page parameter (`page`) is not defined
        - Returns all match entries with all the above return parameters. 
    - Alphabetically sorts the results by home team first then the away team.

`/search/players`:
- __Description__: Returns an array of selected attributes for players that match the search query
- __Route Parameter(s)__: _None_
- __Query Parameter(s)__: `Name` (string, optional), `Nationality` (string, optional), `Club` (string, optional), `RatingLow` (int, optional) (default: 0), `RatingHigh` (int, optional) (default: 100), `PotentialLow` (int, optional) (default: 0), `PotentialHigh` (int, optional) (default: 100), `page` (int, optional), `pagesize` (int, optional) (default: 10)
- __Route Handler__: `search_players(req, res)`
- __Return Type__: JSON
- __Return Parameters__: {`results` (JSON array of { `PlayerId` (int), `Name` (string), `Nationality` (string), `Rating` (int), `Potential` (int), `Club` (string), `Value` (string) }) }
- __Expected (Output) Behavior__:
    - Returns an array with all players that match the constraints. If no player satisfies the constraints, return an empty array as `results` without causing an error
    - The matching behavior for string-matching is the same as that of the LIKE function in MySQL
    - __Case 1__: If the page parameter (`page`) is defined
        - Returns match entries with all the above return parameters for that page number by considering the `page` and `pagesize` parameters. For example, page 1 and page 7 for a page size 10 should have entries 1 through 10 and 61 through 70 respectively
    - __Case 2:__ If the page parameter (`page`) is not defined
        - Returns all match entries with all the above return parameters. 
    - xHigh and xLow are the upper and lower bound filters for an attribute x and are inclusive bounds.
    - Alphabetically sorts the results by player name