const { Message, Client, EmbedBuilder } = require('discord.js');
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
 * @param {Message} message 
 * @returns 
 */
async function changelog(client, message) {

    if (message.author.id !== Constants.DISCORD_BOT_OWNER) {
        return;
    }
    
    if (message.content === Constants.COMMAND_DM.prefix + "changelog") {
        if (message.attachments.size === 0) {
            await message.channel.send("No attachment");
            return;
        }
        message.attachments.forEach(async (attachment) => {
    
            if (!attachment.contentType.startsWith('application/json')) {
                return;
            }
            let data = (await axios(attachment.url)).data;
            let changelogDate = new Date();
            let changelogDateStr = changelogDate.getFullYear() + '-' + (changelogDate.getMonth() + 1) + '-' + changelogDate.getDate();
            fs.writeFileSync('./changelogs/changelog.' + changelogDateStr + '.json', JSON.stringify(data));
        });
    } else if (message.content.startsWith(Constants.COMMAND_DM.prefix + "changelog ")) {
        let cmd = message.content.split(' ')[1];
        if (cmd === "push") {
            let lastContent = getLastContent();

            let embed = new EmbedBuilder()
            .setTitle(lastContent.title)
            .setDescription(lastContent.description)
            .setColor(0xbb2222)
            .setTimestamp(Date.now())
            .addFields(lastContent.fields);
            let channels = await DiscordUtils.getTextChannels(client);
            if (!Array.isArray(channels)) {
                await message.channel.send("Error: No channel found. Unable to send changelog to any channel.");
                return;
            }
            channels.forEach(async element => {
                await element.send({
                    content: global.i18n.__("NEW_UPDATE") + ":",
                    embeds: [embed]
                });
            });
        } else if (cmd === "check") {
            let lastContent = getLastContent();

            let embed = new EmbedBuilder()
            .setTitle(lastContent.title)
            .setDescription(lastContent.description)
            .setColor(0xbb2222)
            .setTimestamp(Date.now())
            .addFields(lastContent.fields);

            await message.channel.send({
                content: global.i18n.__("NEW_UPDATE") + ":",
                embeds: [embed]
            });
        }
    }
    
}

module.exports = changelog;