const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds
    ] 
});
const mysql = require('mysql2/promise');
const Constants = require('./classes/Constants');
const EpicStore = require('./classes/EpicStore');
const DiscordUtils = require('./functions/discord_utils');
const Utils = require('./functions/utils');

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
    if (!Array.isArray(games) || games.length === 0) {
        return null;
    }
    let txt = '';
    for (let i = 0; i < games.length; i++) {
        let link = '';
        if (games[i].getNamespace() == '') {
            link = games[i].getLink();
        } else {
            link = games[i].getPurchaseLink();
        }
        txt += games[i].getLabel() + ": [récupérer ici](" + link + ")" + (i < games.length - 1 ? '\n' : '');
    }
    let title = (games.length === 1 ? "Jeu gratuit " : "Jeux gratuits ") + "à récupérer en ce moment sur l'Epic Games Store";
    let embed = new EmbedBuilder();
    embed.addFields([
        {
            name: title,
            value: txt,
            inline: false
        }
    ]);
    embed.setColor(0x18e1ee);
    embed.setTimestamp(Date.now());
    Utils.log("Message to be sent: \n\"" + txt + "\"");
    return embed;
}

/**
 * Send a message to every servers that added this bot
 * @param {Discord.Client} client 
 * @param {EmbedBuilder} embed 
 * @returns 
 */
async function sendFreeGameMessage(client, embed) {
    let channels = await DiscordUtils.getTextChannels(client);

    if (channels == undefined) {
        return;
    }
    channels.forEach(async element => {
        await element.send({
            embeds: [embed]
        });
    });
}

client.login(Constants.DISCORD_TOKEN);

client.once('ready', async () => {
    console.log('Connected');
    let embed = await craftEpicGamesMessage();
    if (embed) {
        await sendFreeGameMessage(client, embed);
    } else {
        Utils.log("No message to send");
    }
    process.exit();
});
