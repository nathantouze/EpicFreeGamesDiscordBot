const { Interaction } = require('discord.js');

/**
 * Computes the total price of the games Epic Games "gave" since the beginning
 * @param {Interaction} interaction
 */
async function total(interaction) {

    let [rows] = await global.db.query("SELECT SUM(og_price) as total FROM `free_games`");

    let total = Number(rows[0].total).toFixed(2);

    const local_respones = {
        "fr": `Au total, Epic Games a donné l'équivalent de ${total}€ de jeux`,
        "en-US": `In total, Epic Games gave away ${total}€ of games`,
        default: `In total, Epic Games gave away ${total}€ of games`
    }

    await interaction.reply(local_respones[interaction.locale] || local_respones.default);
}


module.exports = total;