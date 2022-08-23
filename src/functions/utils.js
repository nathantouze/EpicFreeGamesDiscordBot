const Constants = require('../classes/Constants');

function log(msg) {
    if (process.env.LOGS === "enabled") {
        console.log(msg);
    }
}

function getStoreLabel(id)  {
    switch (id) {
        case Constants.LAUNCHER.EPIC: return "Epic Games";
        case Constants.LAUNCHER.STEAM: return "Steam";
        default: return "Unknown";
    }
}

/**
 * Replace all elements in string
 * @param {String} string 
 * @returns {String}
 */
function replaceAll(string, search, replacement) {

    while (string.includes(search)) {
        string = string.replace(search, replacement);
    }
    return string;
}

/**
 * Returns true if the passed element is an array with at least one element.
 * @param {any} element 
 * @returns {Boolean}
 */
function isNonEmptyArray(element) {
    
    if (element == null) {
        return false;
    }
    if (typeof(element) == 'object' && element.length >= 1) {
        return true;
    } else {
        return false;
    }
}


/**
 * Sleep function
 * @param {Number} ms milliseconds
 * @returns 
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Formats a date this way "dd/mm/yyyy" as a string
 * @param {Date} date 
 * @returns {String}
 */
function slashFormatDate(date) {

    let day = date.getUTCDate() < 10 ? "0" + date.getUTCDate() : date.getUTCDate();
    let month = date.getUTCMonth() < 10 ? "0" + date.getUTCMonth() : date.getUTCMonth();
    let year = date.getUTCFullYear();

    return day + "/" + month + "/" + year;
}

/**
 * Returns the command sent or null if none is triggered
 * @param {String} msg 
 * @returns {String | null}
 */
function isCommand(msg) {

    for (let i = 0; i < Constants.COMMANDS.cmd.length; i++) {
        if (msg.startsWith(Constants.COMMANDS.prefix + Constants.COMMANDS.cmd[i].name + " ") || 
        msg === Constants.COMMANDS.prefix + Constants.COMMANDS.cmd[i].name) {
            return i + 1;
        }
    }
    return Constants.COMMAND_ID.NONE;
}

/**
 * Gets the date object from european string such as dd/mm/yyyy
 * @param {string} string 
 * @returns {Date}
 */
function initDateFromEUString(string) {

    let av = string.split("/");

    if (av.length != 3 || Number(av[0]) == NaN || Number(av[1]) == NaN || Number(av[2]) == NaN) {
        return NaN;
    }
    let date = new Date();
    date.setUTCFullYear(Number(av[2]));
    date.setUTCMonth(Number(av[1]));
    date.setUTCDate(Number(av[0]));
    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    return date;
}

/**
 * Get the date formated as MySQL's datetime
 * @param {Date} date 
 * @returns {String}
 */
function dateToDateTime(date) {

    let day = date.getUTCDate() < 10 ? "0" + date.getUTCDate() : date.getUTCDate();
    let month = date.getUTCMonth() < 10 ? "0" + date.getUTCMonth() : date.getUTCMonth();
    let year = date.getUTCFullYear();

    let hour = date.getUTCHours() < 10 ? "0" + date.getUTCHours() : date.getUTCHours();
    let minutes = date.getUTCMinutes() < 10 ? "0" + date.getUTCMinutes() : date.getUTCMinutes();
    let seconds = date.getUTCSeconds() < 10 ? "0" + date.getUTCSeconds() : date.getUTCSeconds();

    return "" + year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
}

module.exports = {
    log,
    getStoreLabel,
    isNonEmptyArray,
    sleep,
    isCommand,
    slashFormatDate,
    replaceAll,
    initDateFromEUString,
    dateToDateTime
}