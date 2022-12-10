const Constants = require('../classes/Constants');


/**
 * Returns the command sent or null if none is triggered
 * @param {String} msg 
 * @returns {String | null}
 */
function isCommandDM(msg) {

    for (let i = 0; i < Constants.COMMAND_DM.cmd.length; i++) {
        if (msg.startsWith(Constants.COMMAND_DM.prefix + Constants.COMMAND_DM.cmd[i].name + " ") || 
        msg === Constants.COMMAND_DM.prefix + Constants.COMMAND_DM.cmd[i].name) {
            return i + 1;
        }
    }
    return Constants.COMMAND_DM_ID.NONE;
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

module.exports = {
    isCommand,
    isCommandDM,
}