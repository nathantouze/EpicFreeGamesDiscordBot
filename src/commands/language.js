const { Interaction, CommandInteractionOptionResolver, PermissionsBitField } = require("discord.js");
const { logError } = require("../functions/discord_utils");

/**
 * !language command to change the language of the bot
 * @param {Interaction} interaction
 * @param {CommandInteractionOptionResolver} options
 * @returns {Promise<void>}
*/
async function language(interaction, options) {

    if (!interaction.member.permissions.bitfield === PermissionsBitField.All) {
        await logError("User not administrator.");
        const local_admin_only = {
            "fr": "Seul un administrateur peut utiliser cette commande",
            "en-US": "Only an administrator can use this command",
            default: "Only an administrator can use this command"
        }
        return await interaction.reply(local_admin_only[interaction.locale] || local_admin_only.default);
    }

    let language = options.getString("language");

    if (language === "en" || language === "fr") {
        await global.db.query(`UPDATE bot_guilds SET language = ? WHERE id_guild = ?;`, [language, interaction.guild.id]);
        const local_new_language = {
            "fr": "La langue du bot est maintenant ",
            "en-US": "The bot language is now ",
            default: "The bot language is now "
        }

        await interaction.reply((local_new_language[interaction.locale] || local_new_language.default) + language);
    } else {
        const local_err_language = {
            "fr": "La langue doit être 'fr' ou 'en'",
            "en-US": "The language must be 'fr' or 'en'",
            default: "The language must be 'fr' or 'en'"
        }
        await interaction.reply(local_err_language[interaction.locale] || local_err_language.default);
    }
}

module.exports = language;