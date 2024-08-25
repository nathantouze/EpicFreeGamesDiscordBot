const { Client, GatewayIntentBits, EmbedBuilder, GuildBasedChannel } = require('discord.js');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds
    ] 
});
const { I18n } = require('i18n');
const mysql = require('mysql2/promise');

const path = require("path");

const Utils = require('../src/functions/utils');
const GOG = require('../src/classes/GOG');
const EpicStore = require('../src/classes/EpicStore');
const DiscordUtils = require('../src/functions/discord_utils');
const Game = require('../src/classes/Game');
const Guild = require('../src/classes/Guild');
const Constants = require('../src/classes/Constants');


const db_config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    connectionLimit: 10,
};

global.db = mysql.createPool(db_config).on('connection', () => {
    Utils.log("Connected to the database !")
});

var epic = new EpicStore();
var gog = new GOG();

global.i18n = new I18n({
    locales: ['en', 'fr'],
    directory: path.join(__dirname, "..", "locales")
});
global.i18n.setLocale('en');


/**
 * Build the message section for the Epic Games Store
 * @param {Game[]} games 
 */
async function buildEpicMessageSection(games) {

    let txt = '';

    if (games.length === 0) {
        return null
    }

    for (let i = 0; i < games.length; i++) {
        let link = '';
        if (games[i].getNamespace() == '') {
            link = games[i].getLink();
        } else {
            link = games[i].getPurchaseLink();
        }
        txt += games[i].getLabel() + ` (#${games[i].getId()}): [${global.i18n.__("GET_HERE")}](${link})` + (i < games.length - 1 ? '\n' : '');
    }

    return {
        name: games.length === 1 ? global.i18n.__("EPIC_FREE_GAME_TITLE") : global.i18n.__("EPIC_FREE_GAMES_TITLE"),
        value: txt,
        inline: false
    }
}


async function buildGOGMessageSection(games) {

    let txt = '';

    if (games.length === 0) {
        return null
    }

    for (let i = 0; i < games.length; i++) {
        txt += games[i].getLabel() + ` (#${games[i].getId()}): [${global.i18n.__("GET_HERE")}](${Constants.GOG_CLAIM_ENDPOINT})` + (i < games.length - 1 ? '\n' : '');
    }

    return {
        name: games.length === 1 ? global.i18n.__("GOG_FREE_GAME_TITLE") : global.i18n.__("GOG_FREE_GAMES_TITLE"),
        value: txt,
        inline: false
    }
}

async function buildSteamMessageSection(games) {

    let txt = '';

    if (games.length === 0) {
        return null
    }

    for (let i = 0; i < games.length; i++) {
        txt += games[i].getLabel() + ` (#${games[i].getId()}): [${global.i18n.__("GET_HERE")}](${games[i].getLink()})` + (i < games.length - 1 ? '\n' : '');
    }

    return {
        name: games.length === 1 ? global.i18n.__("STEAM_FREE_GAME_TITLE") : global.i18n.__("STEAM_FREE_GAMES_TITLE"),
        value: txt,
        inline: false
    }
}

/**
 * Craft a message with the free games of the day
 * @param {{
 * epic: [Game],
 * gog: [Game],
 * steam: [Game]
 * }} games 
 * @param {GuildBasedChannel} channel 
 * @returns {Promise<EmbedBuilder>}
 */
async function craftMessage(games, channel) {

    let guild = new Guild();
    if (!await guild.init(channel.guildId)) {
        return null;
    }
    let txt = '';
    if (guild.language != 'en' && guild.language != 'fr') {
        guild.language = 'en';
    }

    global.i18n.setLocale(guild.language);


    const epicSection = await buildEpicMessageSection(games.epic);
    const gogSection = await buildGOGMessageSection(games.gog);
    const steamSection = await buildSteamMessageSection(games.steam);


    let embed = new EmbedBuilder();
    let fields = [];
    if (epicSection) {
        fields.push(epicSection);
    }
    if (gogSection) {
        fields.push(gogSection);
    }
    if (steamSection) {
        fields.push(steamSection);
    }
    if (fields.length === 0) {
        fields.push({
            name: global.i18n.__("NO_FREE_GAMES_TITLE"),
            value: ":'(",
            inline: false
        });
    }

    embed.setFields(fields);
    embed.setColor(0x18e1ee);
    embed.setTimestamp(Date.now());
    return embed;
}

client.login(Constants.DISCORD_TOKEN);

client.once('ready', async () => {
    Utils.log("Connected to the Discord bot !");


    const games = {
        epic: await epic.getFreeGames(),
        gog: await gog.getFreePromo(),
        steam: [],
    }

    if (games.epic.length === 0 && games.gog.length === 0 && games.steam.length === 0) {
        Utils.log("No games found.");
        process.exit();
    }

    let textChannels = [];
    if (process.env.NODE_ENV === 'production') {
        textChannels = await DiscordUtils.getTextChannels(client);
    } else if (process.env.NODE_ENV === 'development') {
        textChannels = await DiscordUtils.getDevTextChannels(client);
    } else {
        Utils.log("Invalid NODE_ENV value.");
        process.exit();
    }
    for (let i = 0; i < textChannels.length; i++) {
        let embed = await craftMessage(games, textChannels[i]);
        if (!embed) {
            Utils.log(`Failed to craft message for guild ${textChannels[i].guildId}`);
            continue;
        }
        await textChannels[i].send({
            embeds: [embed]
        })
        Utils.log(`Message sent to guild ${textChannels[i].guildId}`);
    }
    Utils.log("Done.");
    await Utils.sleep(3000);
    process.exit();
});