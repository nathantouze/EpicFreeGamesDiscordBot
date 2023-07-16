const { Client, GatewayIntentBits, EmbedBuilder, GuildBasedChannel } = require('discord.js');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds
    ] 
});

const mysql = require('mysql2/promise');
const Utils = require('../functions/utils');
const EpicStore = require('../classes/EpicStore');
const DiscordUtils = require('../functions/discord_utils');
const Game = require('../classes/Game');
const Guild = require('../classes/Guild');
const { I18n } = require('i18n');
const Constants = require('../classes/Constants');

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

global.i18n = new I18n({
    locales: ['en', 'fr'],
    directory: __dirname + '../../../locales',
});
global.i18n.setLocale('en');




/**
 * Craft a message with the free games of the day
 * @param {[Game]} games 
 * @param {GuildBasedChannel} channel 
 * @returns {Promise<EmbedBuilder>}
 */
async function craftEpicGamesMessage(games, channel) {

    let guild = new Guild();
    if (!await guild.init(channel.guildId)) {
        return null;
    }
    let txt = '';
    if (guild.language != 'en' && guild.language != 'fr') {
        guild.language = 'en';
    }
    global.i18n.setLocale(guild.language);
    for (let i = 0; i < games.length; i++) {
        let link = '';
        if (games[i].getNamespace() == '') {
            link = games[i].getLink();
        } else {
            link = games[i].getPurchaseLink();
        }
        txt += games[i].getLabel() + ` (#${games[i].getId()}): [${global.i18n.__("GET_HERE")}](${link})` + (i < games.length - 1 ? '\n' : '');
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

client.login(Constants.DISCORD_TOKEN);

client.once('ready', async () => {
    Utils.log("Connected to the Discord bot !");
    let games = await epic.getFreeGames();
    if (!games || !Array.isArray(games) || games.length === 0) {
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
        let embed = await craftEpicGamesMessage(games, textChannels[i]);
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