const { Interaction, CommandInteractionOptionResolver } = require('discord.js');
const Constants = require('../classes/Constants');

/**
 * Computes the total price of the games Epic Games "gave" since the beginning
 * @param {Interaction} interaction
 * @param {CommandInteractionOptionResolver} options
 */
async function total(interaction, options) {

    const showEpic = options.getBoolean('epic') || false;
    const showGOG = options.getBoolean('gog') || false;

    let local_respones = {};

    if ((!showEpic && !showGOG) || (showEpic && showGOG)) {
        let [rows] = await global.db.query("SELECT SUM(og_price) as total FROM `free_games`");

        let total = Number(rows[0].total).toFixed(2);

        local_respones = {
            "fr": `Au total, Epic Games et GOG ont donné l'équivalent de ${total}€ de jeux`,
            "en-US": `In total, Epic Games and GOG gave away ${total}€ of games`,
            default: `In total, Epic Games and GOG gave away ${total}€ of games`
        }
    } else if (showEpic && !showGOG) {
        let [rows] = await global.db.query(`SELECT SUM(og_price) as total FROM free_games WHERE id_launcher = ${Constants.LAUNCHER.EPIC}`);

        let total = Number(rows[0].total).toFixed(2);

        local_respones = {
            "fr": `Au total, Epic Games a donné l'équivalent de ${total}€ de jeux`,
            "en-US": `In total, Epic Games gave away ${total}€ of games`,
            default: `In total, Epic Games gave away ${total}€ of games`
        }
    } else if (!showEpic && showGOG) {
        let [rows] = await global.db.query(`SELECT SUM(og_price) as total FROM free_games WHERE id_launcher = ${Constants.LAUNCHER.GOG}`);

        let total = Number(rows[0].total).toFixed(2);

        local_respones = {
            "fr": `Au total, GOG a donné l'équivalent de ${total}€ de jeux`,
            "en-US": `In total, GOG gave away ${total}€ of games`,
            default: `In total, GOG gave away ${total}€ of games`
        }
    }

    await interaction.reply(local_respones[interaction.locale] || local_respones.default);
}


module.exports = total;