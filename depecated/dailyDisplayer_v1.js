const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds
    ] 
});
const mysql = require('mysql2/promise');
const Utils = require('../src/functions/utils');
const DiscordUtils = require('../src/functions/discord_utils');
const Constants = require('../src/classes/Constants');
const EpicStore = require('../src/classes/EpicStore');
const { I18n } = require('i18n');


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
        txt += games[i].getLabel() + `: [${global.i18n.__("GET_HERE")}](" + ${link} + ")` + (i < games.length - 1 ? '\n' : '');
    }
    let title = games.length === 1 ? global.i18n.__("FREE_GAME_TITLE") : global.i18n.__("FREE_GAMES_TITLE");
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

    if (!Array.isArray(channels)) {
        return;
    }
    channels.forEach(async element => {
        await element.send({
            embeds: [embed]
        });
    });
    Utils.log("Message sent.");
}

global.i18n = new I18n({
    locales: ['en', 'fr'],
    directory: __dirname + '../../../locales',
});
global.i18n.setLocale('en');

client.login(Constants.DISCORD_TOKEN);

client.once('ready', async () => {
    Utils.log("Connected to the Discord bot !")
    let embed = await craftEpicGamesMessage();
    if (embed) {
        await sendFreeGameMessage(client, embed);
    } else {
        Utils.log("No message to send.");
    }
    Utils.log("Done.");
    await Utils.sleep(3000);
    process.exit();
});