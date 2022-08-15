const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds
    ] 
});
const mysql = require('mysql2/promise');
const Constants = require('./classes/Constants');
const EpicStore = require('./classes/EpicStore');
const DiscordUtils = require('./functions/discord_utils');

global.db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    connectionLimit: 10,
});

var epic = new EpicStore();


async function craftEpicGamesMessage() {
    let games = await epic.getFreeGames();
    var msg = games.length === 1 ? "Voici le jeu à récupérer sur l'Epic Games Store en ce moment :\n" : "Voici les jeux à récupérer sur l'Epic Games Store en ce moment :\n";

    if (games.length === 0)
        return null;
    else if (games.length === 1) {
        msg += games[0].getLink();
    } else {
        for (let i = 0; i < games.length; i++)
            msg += "<" + games[i].getLink() + ">\n";
    }
    return msg;
}

/**
 * Send a message to every servers that added this bot
 * @param {Discord.Client} client 
 * @param {String} msg 
 * @returns 
 */
async function sendFreeGameMessage(client, msg) {
    let channels = await DiscordUtils.getTextChannels(client);

    if (channels == undefined) {
        return;
    }
    channels.forEach(async element => {
        await element.send(msg);
    });
}

client.login(Constants.DISCORD_TOKEN);

client.once('ready', async () => {
    console.log('Connected');
    let msg = await craftEpicGamesMessage();
    if (msg) {
        await sendFreeGameMessage(client, msg);
    }
    //process.exit();
});
