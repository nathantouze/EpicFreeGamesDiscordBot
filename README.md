# EpicFreeGamesDiscordBot

## Description
Discord bot that warns all the servers it is in when a new game is given for free by Epic Games.
In addition to the script, the bot has serveral commands to get information about the free game system implemented by Epic.
The bot has kept all the data related to theses promotions since the beginning of the Epic Games Store.

## Environment
The bot is written in JavaScript and run with [PM2](https://github.com/Unitech/pm2) to manage the process. 
The *[dailyDisplayer](https://github.com/nathantouze/EpicFreeGamesDiscordBot/blob/master/src/cron/dailyDisplayer.js)* is run every day automatically using crontab.

Finally, this project uses a MySQL database to store all the needed data.

## Getting Started

To install the depedencies, simply run `npm install` at the root of the repository. Then, you will need few environment variables in a *.env* file. 
Those variables are: `DISCORD_TOKEN`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_PORT`, `DB_DATABASE`, `LOGS (enabled|disabled)`.
There are 3 different commands to run depending on what you want to start:

- `npm run bot`: Bot
- `npm run daily`: dailyDisplayer
- `npm start`: Test script

### Commands

An image worths 1000 words: 

![image](https://i.imgur.com/yTjiLFc.png)

## Dependencies
- [axios](https://github.com/axios/axios) v0.21.1
- [discord.js](https://discord.js.org) v14.2.0
- [dotenv](https://github.com/motdotla/dotenv) v8.2.0
- [mysql2](https://github.com/sidorares/node-mysql2) v2.3.0

## Written by
Nathan Touzé
