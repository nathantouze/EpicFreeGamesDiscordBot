
const { Message, EmbedBuilder } = require('discord.js');
const Constants = require('../classes/Constants');

/**
 * Tells the current given game(s)
 * @param {Message} message 
 * @returns {Promise<void>}
 */
async function now(message) {

    let [rows] = await global.db.query('SELECT str_label, str_link, id_item, namespace FROM `free_games` as fg INNER JOIN `free_games_current` as fgc ON fgc.id_free_game = fg.id');

    if (rows.length === 0) {
        await global.db.query(`INSERT INTO logs (type, text) VALUES (?, ?);`, [Constants.LOG_TYPE.ERROR, `No current free game to show`]);
        await message.reply({content: "Aucun jeu gratuit à récupérer en ce moment"});
        return;
    }
    let txt = '';
    for (let i = 0; i < rows.length; i++) {
        let link = '';
        if (rows[i].namespace == '') {
            link = rows[i].str_link;
        } else {
            link = Constants.EPIC_PURCHASE_1 + rows[i].namespace + '-' + rows[i].id_item + Constants.EPIC_PURCHASE_2;
        }
        txt += rows[i].str_label + ": [récupérer ici](" + link + ")" + (i < rows.length - 1 ? '\n' : '');
    }
    let title = (rows.length === 1 ? "Jeu gratuit " : "Jeux gratuits ") + "à récupérer en ce moment sur l'Epic Games Store";
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
    await message.reply({
        embeds: [embed]
    });

}

module.exports = now;