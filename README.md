# Waldner the bot
Angry Creative Table Tennis Ladder BOT!
Named after the best table tennis player of all time, Jan-Ove Waldner AKA Kungen(the king)

## Installation

1. Create a new Slack integration
2. Copy .env.sample to .env
	1. Set `TOKEN` you get from your Slack integration
3. Run `npm install`

## Usage
Start bot
`npm start` - this expects that the project has been built

When developing, and debugging - use `npm run dev`

### Building
`npm run build`

### Running in production

Install [Forever](https://www.npmjs.com/package/forever) if it's not already installed:
`sudo npm install forever -g`

`forever start build/index.js` (You need to install and build first)

#### Stopping in production

`forever stop build/index.js`


###Commands:

All commands is prefixed with the Specified bot name. We will use the default 'waldner' in the examples

`waldner ladder` Shows ladder

`waldner @firstUser @secondUser score1 score2 [score3 score4, ...]`
Stores a game. One player must at least have 11 points, and the users can't have the same points.
Any number of sets separated by a space
Example: `waldner @peter @johan 11-5 11-13 15-13`

`waldner games` Shows the last 5 games

`waldner stats [@user]` Shows stats for user.

`waldner` Shows a random actual Waldner quote.

## TODO
 * Translate and localize all strings
 * Require confirmation from other player
 * Support authentication for accessing API (Token or basic auth?)
