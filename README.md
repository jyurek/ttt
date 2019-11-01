# tic-tac-toe

An API written in Typescript using Express running on node.js for playing
Tic-Tac-Toe over HTTP. The source code is stored in `src` and, when compiled,
the runtime code is placed in `dist`.

## Starting the app

* `npm install`
* `npm start`

The app defaults to running on port 3001. This can be modified by adding
`PORT=[port number]` to `.env` or running the app with the command

* `PORT=[port numer] npm start`

## Playing the Game

* List - `GET` to `/` returns a list of games in progress
* Show - `GET` to `/:id` returns the state of one game
* Create - `POST` to `/` creates and returns a game, with a unique ID so it can be
  identified.
* Move - `POST` to `/:id` will place a move. A body must be supplied giving X and Y as
  a JSON document. e.g. `{ x: 1, y: 2 }`
* Delete - `DELETE` to `/:id` will delete a game and remove it from memory, making it
  unplayable.

The Move request should be made with the `Content-Type` header set to
`application/json` so the body can be parsed properly.

Created games have IDs that start at 100 and go up from there. Also, there is no
persistence. So if the server goes down, all games are lost. Both of these
things might be affected by putting in a persistence solution but that's up to
that developer.

## Tests

Tests will run without any other dependencies. They can be run with the command

`npm test`

and will generate text coverage data in the `coverage/` directory.

# Original README

## Background

The 3T Corp has decided to take the famous paper-and-pencil game, tic-tac-toe, to the web! 3T has contacted The Gnar Company to work with their team to build the web version of tic-tac-toe. As the engineer assigned to the project, you are tasked with building an API that allows users to create new games, marking a player's move on the board, and decide the winner of the game. More information on the rules of tic-tac-toe can be found [here](https://en.wikipedia.org/wiki/Tic-tac-toe).

## Tasks

* Create a data model that facilitates creating a game and marking a move on the board.
* Build an API with endpoints for creating a game and marking a move on the board.
* The API response when marking a space on the board should inform the front-end of the moves taken in the game, and whether or not there is a winner at this point in the game.
* Submit your code as a Pull Request in this repository.

## Assumptions

* No user records or user auth is required, the 2 players can be assumed to alternate turns.
* 3T will handle the front-end development, only the API is required from The Gnar Company team.
* This will be the API code that ships to production
* You may add any tool, framework, or technology to complete the task.
* Please feel free to ask questions about the project with other Gnar Team Members.
* 3T has booked no more than 4 hours of your time!

