const { Message, MessagePayload } = require("discord.js");

/**
 * !language command to change the language of the bot
 * @param {Message} message
 * @returns {Promise<void>}
*/
async function language(message, id_user) {


    let argv = message.content.split(' ');
    if (argv.length < 2) {
        await message.reply({content: global.i18n.__("ENTER_LANGUAGE") });
        return;
    } else {
        if (argv[1] === "en" || argv[1] === "fr") {
            await global.db.query(`UPDATE bot_dm_channels SET language = ? WHERE id_user = ?;`, [argv[1], id_user]);
            global.i18n.setLocale(argv[1]);
            await message.reply({
                content: global.i18n.__("LANGUAGE_CHANGED")
                
            });
        } else {
            await message.reply({content: global.i18n.__("ERROR_LANGUAGE")});
        }
    }
}

module.exports = language;