
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

module.exports = {
    initDateFromEUString,
    dateToDateTime,
    slashFormatDate
}