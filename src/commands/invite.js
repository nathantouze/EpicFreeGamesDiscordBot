const { Interaction } = require('discord.js');
const Contants = require('../classes/Constants');

/**
 * Displays invite link
 * @param {Interaction} interaction
 * @returns
*/
async function invite(interaction) {

    await interaction.reply({content: Contants.INVITE_LINK});
}

module.exports = invite;