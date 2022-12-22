const { ChatInputCommandInteraction } = require("discord.js");


/**
 * pong
 * @param {ChatInputCommandInteraction} interaction 
 */
async function ping(interaction) {
    await interaction.reply({content: "Pong!"});
}

module.exports = ping;