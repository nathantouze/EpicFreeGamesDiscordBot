const { Interaction, CommandInteractionOptionResolver, EmbedBuilder } = require('discord.js');
const Constants = require('../classes/Constants');
const { logError } = require('../functions/discord_utils');

const { slashFormatDate } = require('../functions/date');


/**
 * Displays info about a game from it's db id
 * @param {Interaction} interaction 
 * @param {CommandInteractionOptionResolver} options
 */
async function info(interaction, options) {

    try {
        let id_game = options.getInteger("id");

        let [rows] = await global.db.query(`\
        SELECT \
            g.id,
            g.id_item, \
            g.namespace, \
            g.str_label, \
            g.str_link, \
            g.og_price, \
            gs.date_start, \
            gs.date_end \
        FROM \
            free_games AS g \
            INNER JOIN free_games_schedule AS gs ON gs.id_game = g.id \
        WHERE \
            g.id = ${global.db.escape(id_game)};`);
        if (rows == null || rows.length == 0) {
            await logError("The game id does not exist (info command).");

            const local_404 = {
                "fr": "Ce jeu n'existe pas",
                "en-US": "This game does not exist",
                default: "This game does not exist"
            }

            await interaction.reply(local_404[interaction.locale] || local_404.default);
            return;
        }
    
    
        let occurences_txt = "";
        for (let i = 0; i < rows.length; i++) {
            let from = new Date(rows[i].date_start);
            let to = new Date(rows[i].date_end);
            occurences_txt += slashFormatDate(from) + ' - ' + slashFormatDate(to) + (i < rows.length - 1 ? "\n" : "");
        }
    
        const local_og_price = {
            "fr": "Prix de base",
            "en-US": "Original price",
            default: "Original price"
        }

        const local_free_periods = {
            "fr": "Périodes de gratuité",
            "en-US": "Free periods",
            default: "Free periods"
        }

        const local_purchase_link = {
            "fr": "Lien d'achat",
            "en-US": "Purchase link",
            default: "Purchase link"
        }


        let embed = new EmbedBuilder()
        .setTitle(rows[0].str_label + ' (#' + rows[0].id + ')')
        .setDescription(rows[0].str_link)
        .setTimestamp(Date.now())
        .setColor(0x18e1ee)
        .addFields([
            {
                name: local_og_price[interaction.locale] || local_og_price.default,
                value: "" + rows[0].og_price + "€",
                inline: false
            },
            {
                name: local_free_periods[interaction.locale] || local_free_periods.default,
                value: occurences_txt,
                inline: false,
            },
            {
                name: local_purchase_link[interaction.locale] || local_purchase_link.default,
                value: Constants.EPIC_PURCHASE_1 + rows[0].namespace + "-" + rows[0].id_item + Constants.EPIC_PURCHASE_2,
                inline: false
            }
        ]);
        await interaction.reply({
            embeds: [embed]
        });
    } catch (error) {
        await logError("Error in info command: " + error);

        const local_error = {
            "fr": "Une erreur est survenue",
            "en-US": "An error occured",
            default: "An error occured"
        }
        await interaction.reply(local_error[interaction.locale] || local_error.default);
    }
}

module.exports = info;