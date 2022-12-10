const { Message, Client, PermissionsBitField, ChannelType } = require("discord.js");
const Constants = require("../classes/Constants");
const { logError } = require("../functions/discord_utils");


/**
 * !channel command to change the text channel to send free games updates
 * @param {Client} client
 * @param {Message} message 
 * @returns {Promise<void>}
 */
async function channel(client, message) {

    if (!message.member.permissions.bitfield === PermissionsBitField.All) {
        await logError("User not administrator.");
        await message.reply({content: global.i18n.__("ONLY_ADMIN")});
        return;
    }

    let argv = message.content.split(' ');

    if (argv.length < 2) {
        await message.reply({content: global.i18n.__("ENTER_CHANNEL_ID") /*"Veuillez préciser l'ID du channel concerné."*/});
        return;
    }
    if (isNaN(argv[1])) {
        await message.reply({content: global.i18n.__("ERROR_ARG")});
        return;
    }
    let guild = await client.guilds.fetch(message.guildId);
    let channel = await guild.channels.fetch(argv[1]).catch(() => {});
    if (channel == null) {
        await message.reply({content: global.i18n.__("ERROR_ID_404")});
        return;
    } else if (channel.type !== ChannelType.GuildText) {
        await message.reply({content: global.i18n.__("ERROR_CHANNEL_TYPE")});
        return;
    }
    await global.db.query(`UPDATE bot_guilds_text_channel SET id_channel = ?, id_setup_user = ?, str_label = ? WHERE id_guild = ?;`, [channel.id, message.author.id, channel.name, guild.id]);
    await message.reply({content: global.i18n.__("NEW_CHANNEL") + `<#${channel.id}>`});
}

module.exports = channel;