
const { Interaction, CommandInteractionOptionResolver, EmbedBuilder } = require('discord.js');
const Constants = require('../classes/Constants');


function buildEpicSection(games, locale) {
    
    if (games.length === 0) {
        return null;
    }

    const local_response_get_here = {
        "fr": `Obtenir ici`,
        "en-US": `Get here`,
        default: `Get here`
    }

    let txt = '';
    for (let i = 0; i < games.length; i++) {
        let link = '';
        if (games[i].namespace == '') {
            link = games[i].str_link;
        } else {
            link = Constants.EPIC_PURCHASE_1 + games[i].namespace + '-' + games[i].id_item + Constants.EPIC_PURCHASE_2;
        }
        txt += games[i].str_label + ` (#${games[i].id}): [${local_response_get_here[locale] || local_response_get_here.default}](${link})` + (i < games.length - 1 ? '\n' : '');
    }

    let title = function () {
        if (games.length === 1) {
            const local_response_title = {
                "fr": `Jeu gratuit actuellement sur l'Epic Games Store`,
                "en-US": `Free game currently on the Epic Games Store`,
                default: `Free game currently on the Epic Games Store`
            }
            return local_response_title[locale] || local_response_title.default;
        } else {
            const local_response_title = {
                "fr": `Jeux gratuits actuellement sur l'Epic Games Store`,
                "en-US": `Free games currently on the Epic Games Store`,
                default: `Free games currently on the Epic Games Store`
            }
            return local_response_title[locale] || local_response_title.default;
        }
    }();

    return {
        name: title,
        value: txt,
        inline: false
    }
}


function buildGOGMessageSection(games, locale) {

    if (games.length === 0) {
        return null;
    }

    const local_response_get_here = {
        "fr": `Obtenir ici`,
        "en-US": `Get here`,
        default: `Get here`
    }

    let txt = '';
    const link = Constants.GOG_CLAIM_ENDPOINT;

    for (let i = 0; i < games.length; i++) {
        txt += games[i].str_label + ` (#${games[i].id}): [${local_response_get_here[locale] || local_response_get_here.default}](${link})` + (i < games.length - 1 ? '\n' : '');
    }

    let title = function () {
        if (games.length === 1) {
            const local_response_title = {
                "fr": `Jeu gratuit actuellement sur GOG`,
                "en-US": `Free game currently on GOG`,
                default: `Free game currently on GOG`
            }
            return local_response_title[locale] || local_response_title.default;
        } else {
            const local_response_title = {
                "fr": `Jeux gratuits actuellement sur GOG`,
                "en-US": `Free games currently on GOG`,
                default: `Free games currently on GOG`
            }
            return local_response_title[locale] || local_response_title.default;
        }
    }();

    return {
        name: title,
        value: txt,
        inline: false
    }
}



function buildSteamMessageSection(games, locale) {

    if (games.length === 0) {
        return null;
    }

    const local_response_get_here = {
        "fr": `Obtenir ici`,
        "en-US": `Get here`,
        default: `Get here`
    }

    let txt = '';
    for (let i = 0; i < games.length; i++) {
        txt += games[i].str_label + ` (#${games[i].id}): [${local_response_get_here[locale] || local_response_get_here.default}](${games[i].str_link})` + (i < games.length - 1 ? '\n' : '');
    }

    let title = function () {
        if (games.length === 1) {
            const local_response_title = {
                "fr": `Jeu gratuit actuellement sur Steam`,
                "en-US": `Free game currently on Steam`,
                default: `Free game currently on Steam`
            }
            return local_response_title[locale] || local_response_title.default;
        } else {
            const local_response_title = {
                "fr": `Jeux gratuits actuellement sur Steam`,
                "en-US": `Free games currently on Steam`,
                default: `Free games currently on Steam`
            }
            return local_response_title[locale] || local_response_title.default;
        }
    }();

    return {
        name: title,
        value: txt,
        inline: false
    }
}


/**
 * Tells the current given game(s)
 * @param {Interaction} interaction
 * @param {CommandInteractionOptionResolver} options 
 * @returns {Promise<void>}
 */
async function now(interaction, options) {

    let [rows] = await global.db.query('SELECT fg.id, str_label, str_link, id_item, namespace, id_launcher FROM `free_games` as fg INNER JOIN `free_games_current` as fgc ON fgc.id_free_game = fg.id');

    if (rows.length === 0) {
        await global.db.query(`INSERT INTO logs (type, text) VALUES (?, ?);`, [Constants.LOG_TYPE.ERROR, `No current free game to show`]);

        const local_responses_err = {
            "fr": `Aucun jeu gratuit à récupérer en ce moment`,
            "en-US": `No free game to get now`,
            default: `No free game to get now`
        }
        await interaction.reply(local_responses_err[interaction.locale] || local_responses_err.default);
        return;
    }

    const epic_games = rows.filter((row) => row.id_launcher === Constants.LAUNCHER.EPIC);
    const gog_games = rows.filter((row) => row.id_launcher === Constants.LAUNCHER.GOG);
    const steam_games = rows.filter((row) => row.id_launcher === Constants.LAUNCHER.STEAM);

    let sections = [];

    if (epic_games.length > 0) {
        sections.push(buildEpicSection(epic_games, interaction.locale));
    }
    if (gog_games.length > 0) {
        sections.push(buildGOGMessageSection(gog_games, interaction.locale));
    }
    if (steam_games.length > 0) {
        sections.push(buildSteamMessageSection(steam_games, interaction.locale));
    }
    if (sections.length === 0) {
        await global.db.query(`INSERT INTO logs (type, text) VALUES (?, ?);`, [Constants.LOG_TYPE.ERROR, `No current free game to show`]);

        const local_responses_err = {
            "fr": `Aucun jeu gratuit à récupérer en ce moment`,
            "en-US": `No free game to get now`,
            default: `No free game to get now`
        }
        
        sections.push({
            name: local_responses_err[interaction.locale] || local_responses_err.default,
            value: ' ',
            inline: false
        })
    }

    let embed = new EmbedBuilder();
    embed.addFields(sections);
    embed.setColor(0x18e1ee);
    embed.setTimestamp(Date.now());
    await interaction.reply({
        embeds: [embed]
    });

}

module.exports = now;