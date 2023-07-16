const { Message } = require('discord.js');
const fs = require('fs');

const { slashFormatDate, dateToDateTime, initDateFromEUString } = require('../functions/date');
const { replaceAll } = require('../functions/stringManagement');


/**
 * Detects if the arguments have an error
 * @param {[String]} argv 
 * @returns {boolean}
 */
function error_in_args(argv) {
    
    let from = argv.length >= 1 ? initDateFromEUString(argv[0]) : null;
    let to = argv.length >= 2 ? initDateFromEUString(argv[1]) : null;

    if ((from != null && isNaN(from.valueOf())) || (to != null && isNaN(to.valueOf()))) {
        return true;
    } else {
        return false;
    }
}

 

/**
 * Creates the text to be sent as a reply
 * @param {String} locale
 * @param {[{id: Number, str_label: String, str_link: String}]} games 
 * @param {Date} from
 * @param {Date} to
 * @returns {String}
 */
function makeTxt(locale, games, from=null, to=null) {


    const local_free_games_list = {
        "fr": "Voici la liste des jeux donnés",
        "en-US": "Here is the list of the games given",
        default: "Here is the list of the games given"
    }

    const local_free_games_list_2 = {
        "fr": "depuis le début du store",
        "en-US": "since the beginning of the store",
        default: "since the beginning of the store"
    }

    const local_from = {
        "fr": " depuis le ",
        "en-US": " from ",
        default: " from "
    }

    const local_to = {
        "fr": " jusqu'au ",
        "en-US": " until ",
        default: " until "
    }

    let txt = local_free_games_list[locale] || local_free_games_list.default;

    if (from == null) {
        txt += (local_free_games_list_2[locale] || local_free_games_list_2.default) + ":\n";
    } else if (from != null && to == null) {
        txt += (local_from[locale] || local_from.default) + slashFormatDate(from) + ":\n";
    } else {
        txt += (local_from[locale] || local_from.default) + slashFormatDate(from) + (local_to[locale] || local_to.default) + slashFormatDate(to) + ":\n";
    }

    if (games.length > 10) {
        for (let i = 0; i < games.length; i++) {
            txt += "- #" + games[i].id + "\t" + games[i].str_label + " (" + games[i].str_link + ")" + (i < games.length - 1 ? "\n" : "");
        }
    } else {
        for (let i = 0; i < games.length; i++) {
            txt += "- #" + games[i].id + "\t" + games[i].str_label + " (<" + games[i].str_link + ">)" + (i < games.length - 1 ? "\n" : "");
        }
    }
    return txt;
}

/**
 * Creates the query to fetch the games
 * @param {Date} from 
 * @param {Date} to 
 */
function makeQuery(from=null, to=null) {

    return ` \
    SELECT \
        id, \
        str_label, \
        str_link \
    FROM \
        free_games \
    ${from != null || to != null ? 'WHERE' : ''} \
        ${from == null ? "" : `date_start > ${global.db.escape(dateToDateTime(from))} ${to != null ? 'AND ' : ''}`} \
        ${to == null ? "" : `date_start < ${global.db.escape(dateToDateTime(to))}`} \
    ORDER BY \
        date_start ASC;`
}

/**
 * List all the free games since the beginning
 * @param {import('discord.js').Interaction} interaction 
 * @param {Date} from
 * @param {Date} to
 */
async function sendList(interaction, from=null, to=null) {

    try {
        let query = makeQuery(from, to);
        let [rows] = await global.db.query(query);
        let txt = makeTxt(interaction.locale, rows, from, to);
    
        if (rows.length > 10) {
            let dateTxt = slashFormatDate(new Date());
            dateTxt = replaceAll(dateTxt, "/", "-");
            fs.writeFileSync("tmp/list-" + dateTxt + ".txt", txt);
            await interaction.reply({files: [{
                attachment: "./tmp/list-" + dateTxt + ".txt",
                name: "list.txt"
            }]});
            fs.rmSync("./tmp/list-" + dateTxt + ".txt");
        } else {
            await interaction.reply({content: txt});
        }    
    } catch (error) {
        console.error(error);
        const local_responses_error = {
            "en-US": "An error occured.",
            "fr": "Une erreur est survenue.",
            default: "An error occured."
        }
        await interaction.reply(local_responses_error[interaction.locale] || local_responses_error.default);
    }
}

/**
 * Command that lists all the free games with given arguments
 * @param {import('discord.js').Interaction} interaction 
 * @param {import('discord.js').CommandInteractionOptionResolver} options
 */
async function list(interaction, options) {


    let from = options.getString("from");
    let to = options.getString("to");

    let argv = [];
    if (from != null) {
        argv.push(from);
    }
    if (to != null) {
        argv.push(to);
    }

    if (error_in_args(argv)) {
        const local_responses_error = {
            "en-US": "Argument not valid. Please, use the format `DD/MM/YYYY`.",
            "fr": "Argument non valide. Veuillez utiliser le format `DD/MM/YYYY`.",
            default: "Argument not valid. Please, use the format `DD/MM/YYYY`."
        }
        await interaction.reply(local_responses_error[interaction.locale] || local_responses_error["default"]);
    } else {
        await sendList(interaction, initDateFromEUString(from), initDateFromEUString(to));
    }
}

module.exports = list;