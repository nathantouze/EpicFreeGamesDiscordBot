const { Interaction, CommandInteractionOptionResolver, EmbedBuilder, Client } = require('discord.js');
const Constants = require('../classes/Constants');
const fs = require('fs');
const axios = require('axios').default;
const DiscordUtils = require('../functions/discord_utils');



function getLastContent() {
    let files = fs.readdirSync('./changelogs');
    let lastFile = files[files.length - 1];
    let lastFileContent = fs.readFileSync('./changelogs/' + lastFile, 'utf8');
    return JSON.parse(lastFileContent);
}

/**
 * Send changelog to all the daily displayer channels
 * @param {Client} client
 * @param {Interaction} interaction
 * @param {CommandInteractionOptionResolver} options 
 * @returns 
 */
async function changelog(client, interaction, options) {

    if (interaction.user.id !== Constants.DISCORD_BOT_OWNER) {
        const local_admin_only = {
            "fr": "Seul le propriétaire du bot peut utiliser cette commande",
            "en-US": "Only the bot owner can use this command",
            default: "Only the bot owner can use this command"
        }
        return await interaction.reply(local_admin_only[interaction.locale] || local_admin_only.default);
    }
    

    const attachment = options.getAttachment("file");
    if (attachment != null) {
        if (!attachment.contentType.startsWith('application/json')) {
            return await interaction.reply("Not a JSON file");
        }
        let data = (await axios(attachment.url)).data;
        let changelogDate = new Date();
        let changelogDateStr = changelogDate.getFullYear() + '-' + (changelogDate.getMonth() + 1) + '-' + changelogDate.getDate();
        fs.writeFileSync('./changelogs/changelog.' + changelogDateStr + '.json', JSON.stringify(data));
        return await interaction.reply("Changelog saved");
    }

    const action = options.getString("action");
    if (action === "push") {
        let lastContent = getLastContent();

        let embed = new EmbedBuilder()
        .setTitle(lastContent.title)
        .setDescription(lastContent.description)
        .setColor(0xbb2222)
        .setTimestamp(Date.now())
        .addFields(lastContent.fields);
        let channels = await DiscordUtils.getTextChannels(client);
        if (!Array.isArray(channels)) {
            return await message.channel.send("Error: No channel found. Unable to send changelog to any channel.");
        }
        channels.forEach(async element => {
            await element.send({
                content: "New update:",
                embeds: [embed]
            });
        });
    } else if (action === "check") {
        let lastContent = getLastContent();

        let embed = new EmbedBuilder()
        .setTitle(lastContent.title)
        .setDescription(lastContent.description)
        .setColor(0xbb2222)
        .setTimestamp(Date.now())
        .addFields(lastContent.fields);

        await interaction.reply({
            content: "New update:",
            embeds: [embed]
        });
    }    
}

module.exports = changelog;