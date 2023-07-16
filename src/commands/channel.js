const { Client, Interaction, CommandInteractionOptionResolver, PermissionsBitField, ChannelType } = require("discord.js");
const { logError } = require("../functions/discord_utils");
const Guild = require("../classes/Guild");

/**
 * !channel command to change the text channel to send free games updates
 * @param {Client} client
 * @param {Interaction} interaction 
 * @param {CommandInteractionOptionResolver} options
 * @returns {Promise<void>}
 */
async function channel(client, interaction, options) {

    const local_admin_only = {
        "fr": "Seul un administrateur peut utiliser cette commande",
        "en-US": "Only an administrator can use this command",
        default: "Only an administrator can use this command"
    }

    if (!interaction.member.permissions.bitfield === PermissionsBitField.All) {
        await logError("User not administrator.");
        await interaction.reply(local_admin_only[interaction.locale] || local_admin_only.default);
        return;
    }

    const local_404 = {
        "fr": "Ce channel n'existe pas",
        "en-US": "This channel does not exist",
        default: "This channel does not exist"
    }

    const local_err_channel_type = {
        "fr": "Le channel doit être un channel texte",
        "en-US": "The channel must be a text channel",
        default: "The channel must be a text channel"
    }

    const local_new_channel = {
        "fr": "Le channel d'info des jeux gratuits est maintenant ",
        "en-US": "The free games info channel is now ",
        default: "The free games info channel is now "
    }

    let channel = options.getChannel("channel");
    if (channel == null) {
        return await interaction.reply(local_404[interaction.locale] || local_404.default);
    } else if (channel.type !== ChannelType.GuildText) {
        return await interaction.reply(local_err_channel_type[interaction.locale] || local_err_channel_type.default);
    }
    let thisGuild = new Guild();
    if (!await thisGuild.init(interaction.guildId)) {
        await logError("Could not init guild in channel command.");
        const local_err = {
            "fr": "Une erreur est survenue",
            "en-US": "An error occured",
            default: "An error occured"
        }
        return await interaction.reply(local_err[interaction.locale] || local_err.default);
    }

    await thisGuild.updateTextChannel(channel.name, channel.id, interaction.member.user.id);
    await interaction.reply({content: (local_new_channel[interaction.locale] || local_new_channel.default) + `<#${channel.id}>`});
}

module.exports = channel;