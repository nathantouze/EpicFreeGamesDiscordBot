const { Client, Message } = require('discord.js');

/**
 * Computes the total price of the games Epic Games "gave" since the beginning
 * @param {Message} message
 */
async function total(message) {

    let [rows] = await global.db.query("SELECT SUM(og_price) as total FROM `free_games`");

    let total = Number(rows[0].total).toFixed(2);
    await message.reply({content: `Au total, Epic Games a donné l'équivalent de ${total}€ de jeux depuis le début du store`});
}


module.exports = total;