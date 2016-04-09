# Waldner the bot
Angry Creative Table Tennis Ladder BOT!

## Installation
`npm install`

## Usage
Start bot
`npm start` - this expects that the project has been built

When developing, and debugging - use `npm run dev`

### Building
`npm run build`

###Commands:

All commands is prefixed with 'waldner' (or whatever the bot's name is)

`waldner ladder` Shows ladder

`waldner @firstUser @secondUser score1 score2 [,score3 score4, ...]`
Stores a game. One player must at least have 11 points, and the user can't have the same points.
Any number of sets separated by a comma

`waldner games` Shows the last 5 games
