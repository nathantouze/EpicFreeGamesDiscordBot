
const { Message } = require('discord.js');
const Constants = require('../classes/Constants');

/**
 * Tells the current given game(s)
 * @param {Message} message 
 * @returns {Promise<void>}
 */
async function now(message) {

    let [rows] = await global.db.query('SELECT str_label, str_link, id_item, namespace FROM `free_games` as fg INNER JOIN `free_games_current` as fgc ON fgc.id_free_game = fg.id');
    let replyText = '';

    if (rows.length === 0) {
        await global.db.query(`INSERT INTO logs (type, text) VALUES (?, ?);`, [Constants.LOG_TYPE.ERROR, `No current free game to show`]);
        await message.reply({content: "Aucun jeu gratuit à récupérer en ce moment"});
        return;
    }
    if (rows.length == 1) {
        let link = "";
        if (rows[0].namespace != '') {
            link = Constants.EPIC_PURCHASE_1 + rows[0].namespace + '-' + rows[0].id_item + Constants.EPIC_PURCHASE_2;
        } else {
            link = rows[0].str_link;
        }
        replyText = "Voici le jeu gratuit à récupérer en ce moment sur l'Epic Game store:\n" + rows[0].str_label + " (<" + link + ">)";
        await message.reply({content: replyText});
        return;
    }
    replyText = "Voici les jeux à récupérer sur l'Epic Game store en ce moment:\n";
    for (let i = 0; i < rows.length; i++) {
        let link = "";
        if (rows[i].namespace != '') {
            link = Constants.EPIC_PURCHASE_1 + rows[i].namespace + '-' + rows[i].id_item + Constants.EPIC_PURCHASE_2;
        } else {
            link = rows[i].str_link;
        }
        replyText += "- " + rows[i].str_label + " (<" + link + ">)" + (i < rows.length - 1 ? "\n" : "");
    }
    await message.reply({content: replyText});
}

module.exports = now;