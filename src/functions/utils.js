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


function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
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

module.exports = {
    log,
    getStoreLabel,
    isNonEmptyArray,
    sleep,
    randomBetween
}