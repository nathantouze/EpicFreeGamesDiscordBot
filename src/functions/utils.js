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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    log,
    getStoreLabel,
    sleep
}