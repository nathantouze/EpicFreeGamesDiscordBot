const { Message, PermissionsBitField } = require("discord.js");
const { logError } = require("../functions/discord_utils");

/**
 * !language command to change the language of the bot
 * @param {Message} message
 * @returns {Promise<void>}
*/
async function language(message) {

    if (!message.member.permissions.bitfield === PermissionsBitField.All) {
        await logError("User not administrator.");
        await message.reply({content: global.i18n.__("ONLY_ADMIN")});
        return;
    }

    let argv = message.content.split(' ');
    if (argv.length < 2) {
        await message.reply({content: global.i18n.__("ENTER_LANGUAGE")});
        return;
    } else {
        if (argv[1] === "en" || argv[1] === "fr") {
            await global.db.query(`UPDATE bot_guilds SET language = ? WHERE id_guild = ?;`, [argv[1], message.guild.id]);
            global.i18n.setLocale(argv[1]);
            await message.reply({content: global.i18n.__("LANGUAGE_CHANGED")});
        } else {
            await message.reply({content: global.i18n.__("ERROR_LANGUAGE")});
            return;
        }
    }
}

module.exports = language;