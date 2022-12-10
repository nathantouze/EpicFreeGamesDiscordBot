const { Client, Message } = require('discord.js');

/**
 * Computes the total price of the games Epic Games "gave" since the beginning
 * @param {Message} message
 */
async function total(message) {

    let [rows] = await global.db.query("SELECT SUM(og_price) as total FROM `free_games`");

    let total = Number(rows[0].total).toFixed(2);
    await message.reply({content: `${global.i18n.__("TOTAL_1")} ${total}€ ${global.i18n.__("TOTAL_2")}`});
}


module.exports = total;