const { Message } = require('discord.js');
const fs = require('fs');

const { slashFormatDate } = require('../functions/utils');
const Utils = require('../functions/utils');


/**
 * Detects if the arguments have an error
 * @param {[String]} argv 
 * @returns {boolean}
 */
function error_in_args(argv) {
    
    let from = argv.length >= 2 ? Utils.initDateFromEUString(argv[1]) : null;
    let to = argv.length >= 3 ? Utils.initDateFromEUString(argv[2]) : null;

    if ((from != null && isNaN(from.valueOf())) || (to != null && isNaN(to.valueOf()))) {
        return true;
    } else {
        return false;
    }
}

 

/**
 * Creates the text to be sent as a reply
 * @param {[{id: Number, str_label: String, str_link: String}]} games 
 * @param {Date} from
 * @param {Date} to
 * @returns {String}
 */
function makeTxt(games, from=null, to=null) {

    let txt = global.i18n.__("FREE_GAMES_LIST");

    if (from == null) {
        txt += global.i18n.__("FREE_GAMES_LIST_2") + ":\n";
    } else if (from != null && to == null) {
        txt += global.i18n.__("FREE_GAMES_FROM") + slashFormatDate(from) + ":\n";
    } else {
        txt += global.i18n.__("FREE_GAMES_FROM") + slashFormatDate(from) + global.i18n.__("FREE_GAMES_TO") + slashFormatDate(to) + ":\n";
    }

    if (games.length > 10) {
        for (let i = 0; i < games.length; i++) {
            txt += "- " + games[i].id + "\t" + games[i].str_label + " (" + games[i].str_link + ")" + (i < games.length - 1 ? "\n" : "");
        }
    } else {
        for (let i = 0; i < games.length; i++) {
            txt += "- " + games[i].id + "\t" + games[i].str_label + " (<" + games[i].str_link + ">)" + (i < games.length - 1 ? "\n" : "");
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

    if (from == null && to == null) {
        return "SELECT id, str_label, str_link FROM free_games ORDER BY date_start ASC;";
    } else if (from != null && to == null) {
        return "SELECT id, str_label, str_link FROM free_games WHERE date_start > '" + Utils.dateToDateTime(from) + "' ORDER BY date_start ASC;";
    } else {
        return "SELECT id, str_label, str_link FROM free_games WHERE date_start BETWEEN '" + Utils.dateToDateTime(from) + "' AND '" + Utils.dateToDateTime(to) + "' ORDER BY date_start ASC;";
    }
}

/**
 * List all the free games since the beginning
 * @param {Message} message 
 * @param {Date} from
 * @param {Date} to
 */
async function sendList(message, from=null, to=null) {

    let query = makeQuery(from, to);
    let [rows] = await global.db.query(query);
    let txt = makeTxt(rows, from, to);

    if (rows.length > 10) {
        let dateTxt = slashFormatDate(new Date());
        dateTxt = Utils.replaceAll(dateTxt, "/", "-");
        fs.writeFileSync("tmp/list-" + dateTxt + ".txt", txt);
        await message.reply({files: [{
            attachment: "./tmp/list-" + dateTxt + ".txt",
            name: "list.txt"
        }]});
        fs.rmSync("./tmp/list-" + dateTxt + ".txt");
    } else {
        message.reply({content: txt});
    }

}

/**
 * Command that lists all the free games with given arguments
 * @param {Message} message 
 */
async function list(message) {

    let argv = message.content.split(' ');

    if (argv.length == 1 || error_in_args(argv)) {
        await sendList(message);
    } else if (argv.length == 2) {
        await sendList(message, Utils.initDateFromEUString(argv[1]));
    } else {
        await sendList(message, Utils.initDateFromEUString(argv[1]), Utils.initDateFromEUString(argv[2]));
    }
}

module.exports = list;