const { Message, EmbedBuilder } = require('discord.js');
const Constants = require('../classes/Constants');
const { logError } = require('../functions/discord_utils');
const { slashFormatDate } = require('../functions/utils');


/**
 * Displays info about a game from it's db id
 * @param {Message} message 
 */
async function info(message) {

    let argv = message.content.split(' ');

    if (argv.length != 2) {
        await message.reply({content: "Veuillez préciser l'ID du jeu concerné."});
        return;
    }
    if (isNaN(argv[1])) {
        await message.reply({content: "L'argument donné n'est pas valide."});
        return;
    }

    let [rows] = await global.db.query("SELECT g.id_item, g.namespace, g.str_label, g.str_link, g.og_price, gs.date_start, gs.date_end FROM free_games AS g INNER JOIN free_games_schedule AS gs ON gs.id_game = g.id WHERE g.id = ?;", [argv[1]]);
    if (rows == null || rows.length == 0) {
        await logError("The game id does not exist (info command).");
        await message.reply({content: "L'ID donné n'existe pas."});
        return;
    }


    let occurences_txt = "";
    for (let i = 0; i < rows.length; i++) {
        let from = new Date(rows[i].date_start);
        let to = new Date(rows[i].date_end);
        occurences_txt += slashFormatDate(from) + ' - ' + slashFormatDate(to) + (i < rows.length - 1 ? "\n" : "");
    }

    let embed = new EmbedBuilder()
    .setTitle(rows[0].str_label)
    .setDescription(rows[0].str_link)
    .setTimestamp(Date.now())
    .setColor(0x18e1ee)
    .addFields([
        {
            name: "Prix d'origine",
            value: "" + rows[0].og_price + "€",
            inline: false
        },
        {
            name: "Périodes de gratuité",
            value: occurences_txt,
            inline: false,
        },
        {
            name: 'Lien d\'achat',
            value: Constants.EPIC_PURCHASE_1 + rows[0].namespace + "-" + rows[0].id_item + Constants.EPIC_PURCHASE_2,
            inline: false
        }
    ]);
    await message.reply({
        embeds: [embed]
    });
}

module.exports = info;