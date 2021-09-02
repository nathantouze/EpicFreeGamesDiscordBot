const Discord = require('discord.js');
const client = new Discord.Client();
const mysql = require('mysql2/promise');

const Utils = require('../functions/utils');
const Constants = require('../classes/Constants');
const EpicStore = require('../classes/EpicStore');



global.db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    connectionLimit: 10,
}).on('connection', () => {
    Utils.log("Connected to the database !")
});

var epic = new EpicStore();


/**
 * Get all "general" channel from the list of servers that added this bot
 * @param {Discord.Client} client 
 * @returns 
 */
function getGeneralChannels(client) {
    let guilds = client.guilds.cache.array();
    let channels = [];

    guilds.forEach(element => {
        channels.push(element.channels.cache.find(channel => channel.name == 'général' || channel.name == 'general'));
    });
    return channels;
}

async function craftEpicGamesMessage() {
    let games = await epic.getFreeGames();
    var msg = games.length === 1 ? "Voici le jeu à récupérer sur l'Epic Games Store en ce moment :\n" : "Voici les jeux à récupérer sur l'Epic Games Store en ce moment :\n";

    if (games.length === 0) {
        return null;
    }
    for (let i = 0; i < games.length; i++) {
        msg += "<" + games[i].getLink() + ">\n";
    }
    Utils.log("Message to be sent: \n\"" + msg + "\"");
    return msg;
}

/**
 * Send a message to every servers that added this bot
 * @param {Discord.Client} client 
 * @param {String} msg 
 * @returns 
 */
async function sendFreeGameMessage(client, msg) {
    let channels = getGeneralChannels(client);

    if (!Array.isArray(channels)) {
        return;
    }
    channels.forEach(async element => {
        await element.send(msg);
    });
    Utils.log("Message sent.");
}

client.login(Constants.DISCORD_TOKEN);

client.once('ready', async () => {
    Utils.log("Connected to the Discord bot !")
    let msg = await craftEpicGamesMessage();
    if (msg) {
        await sendFreeGameMessage(client, msg);
    }
    Utils.log("Done.");
    await Utils.sleep(3000);
    process.exit();
});