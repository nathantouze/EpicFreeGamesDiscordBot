const { Guild, GuildBasedChannel, Interaction, Message, SlashCommandBuilder } = require('discord.js');
const Constants = require('../classes/Constants');


/**
 * Add user into DM channel database
 * @param {String} discordUserId 
 * @param {String} username 
 */
async function addDmUserToDB(discordUserId, username) {

    await global.db.query(`INSERT INTO bot_dm_channels (id_user, username) VALUES (${discordUserId}, ${global.db.escape(username)});`);
}

/**
 * Get the user from the database with the given discord user id
 * @param {String} discordUserId 
 * @returns 
 */
async function getDMUserFromDB(discordUserId) {

    let [rows] = await global.db.query(`SELECT id, username, id_user, language, creation_date FROM bot_dm_channels WHERE id_user = ${discordUserId};`);
    if (rows.length == 0) {
        return null;
    }
    return {
        id: rows[0].id,
        username: rows[0].username,
        id_user: rows[0].id_user,
        language: rows[0].language,
        creation_date: new Date(rows[0].creation_date)
    }
}

/**
 * Get all guilds where the bot has been added
 * @param {Client} client 
 * @returns {Promise<[Guild]>}
 */
async function getAllDevGuilds(client) {

    let [rows] = await global.db.query("SELECT id_guild FROM dev_bot_guilds;");
    let guilds = [];

    for (let i = 0; i < rows.length; i++) {
        let tmp_guild = await client.guilds.fetch(rows[i].id_guild).catch(async () => {
            await global.db.query(`INSERT INTO logs (type, text) VALUES ('${Constants.LOG_TYPE.ERROR}', 'Unable to fetch guild #${rows[i].id_guild}');`);
        });
        if (tmp_guild == null) {
            continue;
        }
        guilds.push(tmp_guild);
    }
    return guilds;
}

/**
 * Get all channels that has been setup from the list of servers that added this bot
 * @param {Client} client 
 * @returns {Promise<[GuildBasedChannel]>}
 */
async function getDevTextChannels(client) {

    let guilds = await getAllDevGuilds(client);
    let channels = [];

    for (let i = 0; i < guilds.length; i++) {
        let [rows] = await global.db.query(`SELECT id_channel FROM dev_bot_guilds_text_channel WHERE id_guild = ${guilds[i].id};`);
        if (rows.length == 0) {
            await global.db.query(`INSERT INTO logs (type, text) VALUES ('${Constants.LOG_TYPE.ERROR}', 'No text channel for the guild #${guilds[i].id}');`);
            continue;
        }
        let tmp_channel = await guilds[i].channels.fetch(rows[0].id_channel).catch(async () => {
            let query = `INSERT INTO logs (type, text) VALUES ('${Constants.LOG_TYPE.ERROR}', 'Not able to fetch channel #${rows[0].id_channel}');`;
            await global.db.query(query);
        });
        if (tmp_channel == null) {
            continue;
        }
        channels.push(tmp_channel);
    }
    return channels;
}


/**
 * Get all guilds where the bot has been added
 * @param {Client} client 
 * @returns {Promise<[Guild]>}
 */
 async function getAllGuilds(client) {

    let [rows] = await global.db.query("SELECT id_guild FROM bot_guilds;");
    let guilds = [];

    for (let i = 0; i < rows.length; i++) {
        let tmp_guild = await client.guilds.fetch(rows[i].id_guild).catch(async () => {
            await global.db.query(`INSERT INTO logs (type, text) VALUES ('${Constants.LOG_TYPE.ERROR}', 'Unable to fetch guild #${rows[i].id_guild}');`);
        });
        if (tmp_guild == null) {
            continue;
        }
        guilds.push(tmp_guild);
    }
    return guilds;
}

/**
 * Get all channels that has been setup from the list of servers that added this bot
 * @param {Client} client 
 * @returns {Promise<[GuildBasedChannel]>}
 */
async function getTextChannels(client) {

    let guilds = await getAllGuilds(client);
    let channels = [];

    for (let i = 0; i < guilds.length; i++) {
        let [rows] = await global.db.query(`SELECT id_channel FROM bot_guilds_text_channel WHERE id_guild = ${guilds[i].id};`);
        if (rows.length == 0) {
            await global.db.query(`INSERT INTO logs (type, text) VALUES ('${Constants.LOG_TYPE.ERROR}', 'No text channel for the guild #${guilds[i].id}');`);
            continue;
        }
        let tmp_channel = await guilds[i].channels.fetch(rows[0].id_channel).catch(async () => {
            let query = `INSERT INTO logs (type, text) VALUES ('${Constants.LOG_TYPE.ERROR}', 'Not able to fetch channel #${rows[0].id_channel}');`;
            await global.db.query(query);
        });
        if (tmp_channel == null) {
            continue;
        }
        channels.push(tmp_channel);
    }
    return channels;
}


/**
 * Register the command in the database as DM
 * @param {String} messageContent
 * @param {String} username
*/
async function logCommandDM(messageContent, username) {
    await global.db.query(`INSERT INTO logs (type, text) VALUES (?, ?);`, [Constants.LOG_TYPE.COMMAND, `${username} sent "${messageContent}" in DM`]);
}


/**
 * Register the command in the database
 * @param {Interaction} interaction 
 */
async function logCommand(interaction) {

    const messageContent = '/' + interaction.commandName + ' ' + interaction.options.data.map(option => {
        return option.name + '=' + option.value;
    }).join(' ');

    let username = "";
    if (interaction.member && interaction.member.user && interaction.member.user.username) {
        username = interaction.member.user.username + (interaction.member.user.discriminator ? "#" + interaction.member.user.discriminator : "");
    } else {
        username = interaction.user && interaction.user.username ? interaction.user.username : "Unknown";
    }

    await global.db.query(`INSERT INTO logs (type, text) VALUES (?, ?);`, [Constants.LOG_TYPE.COMMAND, `${username} sent "${messageContent}" in guild #${interaction.guildId} and channel #${interaction.channelId}`]);
}

/**
 * Register an error log in the database
 * @param {String} txt 
 */
async function logError(txt) {
    await global.db.query("INSERT INTO logs (type, text) VALUES (?, ?);", [Constants.LOG_TYPE.ERROR, txt]);
}


/**
 * 
 * @param {{
 *    name: string,
 *    description: [
 *        {
 *            language: string,
 *            text: string
 *        }
 *    ],
 *    options: [{
*         type: string,
*         name: string,
 *        description: [   
 *            {
 *                language: string,  
 *                text: string    
 *            }
 *        ],
 *        choices: [{
 *            name: string,
 *            value: string
 *        }], 
 *        required: boolean
 *    }],
 *    dm: boolean,
 * }} cmd 
 * @returns 
 */
function buildSlashCommand(cmd) {

    var cmd_descs = cmd.description.reduce((acc, desc) => {
        acc[desc.language] = desc.text;
        return acc;
    }, {});

    var command_builder = new SlashCommandBuilder()
    .setName(cmd.name)
    .setDescription(cmd_descs["en-US"])
    .setDescriptionLocalizations(cmd_descs)
    .setDMPermission(cmd.dm)

    for (let i = 0; i < cmd.options.length; i++) {
        const desc = cmd.options[i].description.reduce((acc, desc) => {
            acc[desc.language] = desc.text;
            return acc;
        }, {});
        switch (cmd.options[i].type) {
            case 'boolean':
                command_builder.addBooleanOption(
                    option => {
                        option
                        .setName(cmd.options[i].name)
                        .setDescription(desc['en-US'])
                        .setDescriptionLocalizations(desc)
                        .setRequired(cmd.options[i].required)
                        return option;
                    }
                )
                break;
            case 'string':
                command_builder.addStringOption(
                    option => {
                        option
                        .setName(cmd.options[i].name)
                        .setDescription(desc['en-US'])
                        .setDescriptionLocalizations(desc)
                        .setRequired(cmd.options[i].required)
                        //.setChoices(cmd.options[i].choices)
                        return option;
                    }
                )
                break;
            case 'number':
                command_builder.addIntegerOption(
                    option => {
                        option
                        .setName(cmd.options[i].name)
                        .setDescription(desc['en-US'])
                        .setDescriptionLocalizations(desc)
                        .setRequired(cmd.options[i].required)
                        return option;
                    }
                )
                break;
            case 'file':
                command_builder.addAttachmentOption(
                    option => {
                        option
                        .setName(cmd.options[i].name)
                        .setDescription(desc['en-US'])
                        .setDescriptionLocalizations(desc)
                        .setRequired(cmd.options[i].required)
                        return option;
                    }
                )
                break;
            case 'channel': {
                command_builder.addChannelOption(
                    option => {
                        option
                        .setName(cmd.options[i].name)
                        .setDescription(desc['en-US'])
                        .setDescriptionLocalizations(desc)
                        .setRequired(cmd.options[i].required)
                        return option;
                    }
                )
                break;
            }
            default:
                break;
        }
    }
    return command_builder;
}

module.exports = {
    getAllDevGuilds,
    getDevTextChannels,
    getAllGuilds,
    getTextChannels,
    logCommand,
    logCommandDM,
    logError,
    getDMUserFromDB,
    addDmUserToDB,
    buildSlashCommand
}