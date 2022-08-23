const { Message, EmbedBuilder } = require('discord.js');

/**
 * Displays helper embed message
 * @param {Message} message 
 */
async function help(message) {

    let cmd_info = [];
    for (let i = 0; i < Constants.COMMANDS.cmd.length; i++) {
        cmd_info.push({
            name: Constants.COMMANDS.cmd[i].proto,
            value: Constants.COMMANDS.cmd[i].description,
            inline: Constants.COMMANDS.cmd[i].inline
        });
    }
    let embed = new EmbedBuilder()
    .setTitle("Commandes")
    .setDescription("Liste des commandes utilisables")
    .setTimestamp(Date.now())
    .setColor(0x18e1ee)
    .addFields(cmd_info);
    await message.reply({
        embeds: [embed]
    });
}

module.exports = help;