const { Message, EmbedBuilder } = require('discord.js');
const Constants = require('../classes/Constants');

/**
 * Displays helper embed message
 * @param {Message} message 
 */
async function help(message) {

    if (message.content === Constants.COMMANDS.prefix + "help") {
        let cmd_info = [];
        for (let i = 0; i < Constants.COMMANDS.cmd.length; i++) {
            cmd_info.push({
                name: Constants.COMMANDS.cmd[i].proto,
                value: global.i18n.__(Constants.COMMANDS.cmd[i].description),
                inline: Constants.COMMANDS.cmd[i].inline
            });
        }
        let embed = new EmbedBuilder()
        .setTitle(global.i18n.__("COMMANDS"))
        .setDescription(global.i18n.__("COMMANDS_LIST"))
        .setTimestamp(Date.now())
        .setColor(0x18e1ee)
        .addFields(cmd_info);
        await message.reply({
            embeds: [embed]
        });
    } else if (message.content === Constants.COMMANDS.prefix + "help dm") {
    
        let cmd_info = [];
        for (let i = 0; i < Constants.COMMAND_DM.cmd.length; i++) {
            cmd_info.push({
                name: Constants.COMMAND_DM.cmd[i].proto,
                value: global.i18n.__(Constants.COMMAND_DM.cmd[i].description),
                inline: Constants.COMMAND_DM.cmd[i].inline
            });
        }
        let embed = new EmbedBuilder()
        .setTitle(global.i18n.__("COMMANDS_DM"))
        .setDescription(global.i18n.__("COMMANDS_DM_LIST"))
        .setTimestamp(Date.now())
        .setColor(0x18e1ee)
        .addFields(cmd_info);
        await message.reply({
            embeds: [embed]
        });
    } else {
        await message.reply({content: global.i18n.__("ERROR_ARG")});
    }
}

module.exports = help;