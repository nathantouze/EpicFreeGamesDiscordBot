const Constants = require('../classes/Constants');

/**
 * Get all guilds where the bot has been added
 * @param {Client} client 
 * @returns {Promise<[import('discord.js').Guild]>}
 */
 async function getAllGuilds(client) {

    let [rows] = await global.db.query("SELECT id_guild FROM bot_guilds;");
    let guilds = [];

    for (let i = 0; i < rows.length; i++) {
        let tmp_guild = await client.guilds.fetch(rows[i].id_guild).catch(async () => {
            await global.db.query(`INSERT INTO logs (type, txt) VALUES ('${Constants.LOG_TYPE.ERROR}', 'Unable to fetch guild #${rows[i].id_guild}');`);
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
 * @returns {Promise<[import('discord.js').Channel]>}
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
 * Register the command in the database
 * @param {import('discord.js').Message} message 
 */
async function logCommand(message) {
    await global.db.query(`INSERT INTO logs (type, text) VALUES (?, ?);`, [Constants.LOG_TYPE.COMMAND, `${message.author.username} sent "${message.content}" in guild #${message.guildId} and channel #${message.channelId}`]);
}

/**
 * Register an error log in the database
 * @param {String} txt 
 */
async function logError(txt) {
    await global.db.query("INSERT INTO logs (type, text) VALUES (?, ?);", [Constants.LOG_TYPE.ERROR, txt]);
}

module.exports = {
    getAllGuilds,
    getTextChannels,
    logCommand,
    logError
}