
const { Interaction, CommandInteractionOptionResolver, EmbedBuilder } = require('discord.js');
const Constants = require('../classes/Constants');

/**
 * Tells the current given game(s)
 * @param {Interaction} interaction
 * @param {CommandInteractionOptionResolver} options 
 * @returns {Promise<void>}
 */
async function now(interaction, options) {

    let [rows] = await global.db.query('SELECT fg.id, str_label, str_link, id_item, namespace FROM `free_games` as fg INNER JOIN `free_games_current` as fgc ON fgc.id_free_game = fg.id');

    if (rows.length === 0) {
        await global.db.query(`INSERT INTO logs (type, text) VALUES (?, ?);`, [Constants.LOG_TYPE.ERROR, `No current free game to show`]);

        const local_responses_err = {
            "fr": `Aucun jeu gratuit actuellement sur l'Epic Games Store`,
            "en-US": `No free game currently on the Epic Games Store`,
            default: `No free game currently on the Epic Games Store`
        }
        await interaction.reply(local_responses_err[interaction.locale] || local_responses_err.default);
        return;
    }

    const local_response_get_here = {
        "fr": `Obtenir ici`,
        "en-US": `Get here`,
        default: `Get here`
    }


    let txt = '';
    for (let i = 0; i < rows.length; i++) {
        let link = '';
        if (rows[i].namespace == '') {
            link = rows[i].str_link;
        } else {
            link = Constants.EPIC_PURCHASE_1 + rows[i].namespace + '-' + rows[i].id_item + Constants.EPIC_PURCHASE_2;
        }
        txt += rows[i].str_label + ` (#${rows[i].id}): [${local_response_get_here[interaction.locale] || local_response_get_here.default}](${link})` + (i < rows.length - 1 ? '\n' : '');
    }

    let title = function () {
        if (rows.length === 1) {
            const local_response_title = {
                "fr": `Jeu gratuit actuellement sur l'Epic Games Store`,
                "en-US": `Free game currently on the Epic Games Store`,
                default: `Free game currently on the Epic Games Store`
            }
            return local_response_title[interaction.locale] || local_response_title.default;
        } else {
            const local_response_title = {
                "fr": `Jeux gratuits actuellement sur l'Epic Games Store`,
                "en-US": `Free games currently on the Epic Games Store`,
                default: `Free games currently on the Epic Games Store`
            }
            return local_response_title[interaction.locale] || local_response_title.default;
        }
    }()

    let embed = new EmbedBuilder();
    embed.addFields([
        {
            name: title,
            value: txt,
            inline: false
        }
    ]);
    embed.setColor(0x18e1ee);
    embed.setTimestamp(Date.now());
    await interaction.reply({
        embeds: [embed]
    });

}

module.exports = now;