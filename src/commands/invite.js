const { Message } = require('discord.js');
const Contants = require('../classes/Constants');

/**
 * Displays invite link
 * @param {Message} message
 * @returns
*/
async function invite(message) {

    await message.reply({content: Contants.INVITE_LINK});
}

module.exports = invite;