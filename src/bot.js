const { Client, GatewayIntentBits, ChannelType, Partials, SlashCommandBuilder } = require('discord.js');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
    ],
});
const mysql = require('mysql2/promise');
const { I18n } = require('i18n');

const { logCommand, getDMUserFromDB, addDmUserToDB, logError, logCommandDM } = require('./functions/discord_utils');

const { isCommand, isCommandDM } = require('./functions/commands');
const Utils = require('./functions/utils');
const Constants = require('./classes/Constants');



const Guild = require('./classes/Guild');
const User = require('./classes/User');

// Load commands
const cmd_dm_changelog = require('./command_dm/changelog');
const cmd_dm_language = require('./command_dm/language');

const cmd_channel = require('./commands/channel');
const cmd_total = require('./commands/total');
const cmd_now = require('./commands/now');
const cmd_list = require('./commands/list');
const cmd_help = require('./commands/help');
const cmd_info = require('./commands/info');
const cmd_language = require('./commands/language');
const cmd_invite = require('./commands/invite');
const cmd_feedback = require('./commands/feedback');

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


/**
 * Handle every possible DM commands
 * @param {Message} message 
 * @returns 
 */
async function handleDMCommands(message) {
    let user = new User();
    if (!await user.init(message.author.id)) {
        await user.create(message.author.id, message.author.username + "#" + message.author.discriminator, 'en');
    }

    global.i18n.setLocale(user.language);
    switch (isCommandDM(message.content)) {
        case Constants.COMMAND_DM_ID.CHANGELOG: {
            await cmd_dm_changelog(client, message);
            break;
        }
        case Constants.COMMAND_DM_ID.LANGUAGE: {
            await cmd_dm_language(message, user.toJSON().id_user);
            break;
        }
        case Constants.COMMAND_DM_ID.HELP: {
            await cmd_help(message);
            break;
        }
        case Constants.COMMAND_DM_ID.INVITE: {
            await cmd_invite(message);
            break;
        }
        case Constants.COMMAND_DM_ID.FEEDBACK: {
            await cmd_feedback(message);
            break;
        }
        default: {
            break;
        }
    }
    return;
}


async function handleGuildCommands(message) {
    let [rows] = await global.db.query('SELECT language FROM bot_guilds WHERE id_guild = ?;', [message.guild.id]);
    if (rows.length > 0) {
        global.i18n.setLocale(rows[0].language);
    } else {
        global.i18n.setLocale('en');
    }
    switch (isCommand(message.content)) {
        case Constants.COMMAND_ID.CHANNEL: {
            await cmd_channel(client, message);
            break;
        }
        case Constants.COMMAND_ID.TOTAL: {
            await cmd_total(message);
            break;
        }
        case Constants.COMMAND_ID.NOW: {
            await cmd_now(message);
            break;
        }
        case Constants.COMMAND_ID.LIST: {
            await cmd_list(message);
            break;
        }
        case Constants.COMMAND_ID.HELP: {
            await cmd_help(message);
            break;
        }
        case Constants.COMMAND_ID.INFO: {
            await cmd_info(message);
            break;
        }
        case Constants.COMMAND_ID.LANGUAGE: {
            await cmd_language(message);
            break;
        }
        case Constants.COMMAND_ID.INVITE: {
            await cmd_invite(message);
            break;
        }
        case Constants.COMMAND_ID.FEEDBACK: {
            await cmd_feedback(message);
            break;
        }
        default: {
            break;
        }
    }
}


client.on('guildDelete', async (guild) => {
    
    let thisGuild = new Guild();
    if (!await thisGuild.init(guild.id)) {
        await global.db.query('INSERT INTO logs (type, text) VALUES (?, ?);', [Constants.LOG_TYPE.ERROR, "Bot could not delete guild #" + guild.id]);
        return;
    }
    await thisGuild.delete();
    await global.db.query('INSERT INTO logs (type, text) VALUES (?, ?);', [Constants.LOG_TYPE.GUILD_KICK, "Bot has been kicked from guild #" + guild.id]);
})

client.on('guildCreate', async (guild) => {
    let raw_channels = guild.channels.cache;

    let text_channels = raw_channels.filter(c => c.type === ChannelType.GuildText);
    let default_channel = text_channels.at(0);

    let thisGuild = new Guild();
    await thisGuild.create(guild.id, guild.name, default_channel.name, default_channel.id, client.user.id);
    await global.db.query('INSERT INTO logs (type, text) VALUES (?, ?), (?, ?);', [Constants.LOG_TYPE.NEW_GUILD, "Joined guild #" + guild.id, Constants.LOG_TYPE.NEW_TEXT_CHANNEL, "Changed text channel to #" + default_channel.id]);
});


client.on('messageCreate', async (message) => {

    // Ignore bot messages
    if (message.author.bot) {
        return;
    }

    // Private message handling
    if (message.channel.type === ChannelType.DM) {
        try {
            await logCommandDM(message.content, message.author.username + "#" + message.author.discriminator);
            await handleDMCommands(message);
        } catch (e) {
            Utils.log(e);
            await logError(`Error while handling DM command ${global.db.escape(message.content)} from ${global.db.escape(message.author.username + "#" + message.author.discriminator)}`);
        }
        return;
    }

    // Guild message handling
    if (isCommand(message.content)) {
        try {
            await logCommand(message);
            await handleGuildCommands(message);
        } catch (e) {
            Utils.log(e);
            await logError(`Error while handling command ${global.db.escape(message.content)} from ${global.db.escape(message.author.username + "#" + message.author.discriminator)} in guild ${global.db.escape(message.guild.name)}`);
        }
        return;
    }
    
});

global.i18n = new I18n({
    locales: ['en', 'fr'],
    directory: __dirname + '/../locales',
});
global.i18n.setLocale('fr');

client.login(Constants.DISCORD_TOKEN);


const slashCommands = [
    new SlashCommandBuilder()
    .setName('channel')
    .setDescription('Change the channel where the bot will send the messages')
    .addChannelOption(option => 
        option
        .setName('channel')
        .setDescription('The channel where the bot will send the messages')
        .setRequired(true)
    ),
];


client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
    if (commandName === 'channel') {
        await cmd_channel(interaction);
    }
});


client.on('ready', async () => {
    for (let i = 0; i < slashCommands.length; i++) {
        await client.application.commands.create(slashCommands[i]);
    }
    Utils.log("Discord bot ready !");
});