const { Message, Client, Guild } = require("discord.js");
const Constants = require("../classes/Constants");


/**
 * !channel command to change the text channel to send free games updates
 * @param {Client} client
 * @param {Message} message 
 * @returns {Promise<void>}
 */
async function channel(client, message) {

    let argv = message.content.split(' ');

    if (argv.length < 2) {
        await message.reply({content: "Veuillez préciser l'ID du channel concerné."});
        return;
    }
    if (isNaN(argv[1])) {
        await message.reply({content: "L'argument donné n'est pas valide."});
        return;
    }
    let guild = await client.guilds.fetch(message.guildId);
    let channel = await guild.channels.fetch(argv[1]).catch(() => {});
    if (channel == null) {
        await message.reply({content: "L'ID du channel n'est pas valide."});
        return;
    }
    await global.db.query(`UPDATE bot_guilds_text_channel SET id_channel = ?, id_setup_user = ?, str_label = ? WHERE id_guild = ?;`, [channel.id, message.author.id, channel.name, guild.id]);
    await message.reply({content: `Le channel d'info des jeux gratuits est maintenant <#${channel.id}>`});
}

module.exports = channel;