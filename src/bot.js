const { Client, GatewayIntentBits, ChannelType, Partials, REST, Routes } = require('discord.js');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
    ],
});
const mysql = require('mysql2/promise');
const nodeMailer = require('nodemailer');


const { logCommand, buildSlashCommand } = require('./functions/discord_utils');

const Utils = require('./functions/utils');
const Constants = require('./classes/Constants');

const Guild = require('./classes/Guild');

// Load commands
const cmd_dm_changelog = require('./commands/changelog');

const cmd_channel = require('./commands/channel');
const cmd_total = require('./commands/total');
const cmd_now = require('./commands/now');
const cmd_list = require('./commands/list');
const cmd_info = require('./commands/info');
const cmd_language = require('./commands/language');
const cmd_invite = require('./commands/invite');
const cmd_feedback = require('./commands/feedback');

const cmd_slash_ping = require('./commands/ping');


global.db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    connectionLimit: 10,
}).on('connection', () => {
    Utils.log("Connected to the database !")
});


client.on('guildDelete', async (guild) => {
    
    let thisGuild = new Guild();
    if (!await thisGuild.init(guild.id)) {
        await global.db.query('INSERT INTO logs (type, text) VALUES (?, ?);', [Constants.LOG_TYPE.ERROR, "Bot could not delete guild #" + guild.id]);
        return;
    }
    try {
        await thisGuild.delete();
    } catch (e) {
        await global.db.query('INSERT INTO logs (type, text) VALUES (?, ?);', [Constants.LOG_TYPE.ERROR, "Bot could not delete guild #" + guild.id]);
        Utils.log("Error while deleting guild #" + guild.id + " : Maybe this guild was already deleted or a development guild");
    }
    await global.db.query('INSERT INTO logs (type, text) VALUES (?, ?);', [Constants.LOG_TYPE.GUILD_KICK, "Bot has been kicked from guild #" + guild.id]);

    let transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: Constants.FEEDBACK_EMAIL,
            pass: Constants.FEEDBACK_EMAIL_PASSWORD
        }
    });
    transporter.sendMail({
        from: "Notification <" + Constants.FEEDBACK_EMAIL + ">",
        to: Constants.FEEDBACK_EMAIL,
        subject: "Guild deleted",
        text: "Deleted guild #" + guild.id + ". Name: " + guild.name + "."
    }, (error, info) => {
        if (error) {
            Utils.log(error);
        }
    });
})

client.on('guildCreate', async (guild) => {
    let raw_channels = guild.channels.cache;

    let text_channels = raw_channels.filter(c => c.type === ChannelType.GuildText);
    let default_channel = text_channels.at(0);

    let thisGuild = new Guild();
    await thisGuild.create(guild.id, guild.name, default_channel.name, default_channel.id, client.user.id);
    await global.db.query('INSERT INTO logs (type, text) VALUES (?, ?), (?, ?);', [Constants.LOG_TYPE.NEW_GUILD, "Joined guild #" + guild.id, Constants.LOG_TYPE.NEW_TEXT_CHANNEL, "Changed text channel to #" + default_channel.id]);

    let transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: Constants.FEEDBACK_EMAIL,
            pass: Constants.FEEDBACK_EMAIL_PASSWORD
        }
    });
    transporter.sendMail({
        from: "Notification <" + Constants.FEEDBACK_EMAIL + ">",
        to: Constants.FEEDBACK_EMAIL,
        subject: "New guild",
        text: "Joined guild #" + guild.id + ". Name: " + guild.name + ". Default channel: #" + default_channel.id + "."
    }, (error, info) => {
        if (error) {
            Utils.log(error);
        }
    });
});

client.login(Constants.DISCORD_TOKEN);

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    switch (commandName) {
        case 'ping': {
            await cmd_slash_ping(interaction);
            break;
        }
        case 'list': {
            await cmd_list(interaction, options);
            break;
        }
        case 'now': {
            await cmd_now(interaction, options);
            break;
        }
        case 'total': {
            await cmd_total(interaction, options);
            break;
        }
        case 'info': {
            await cmd_info(interaction, options);
            break;
        }
        case 'language': {
            await cmd_language(interaction, options);
            break;
        }
        case 'invite': {
            await cmd_invite(interaction);
            break;
        }
        case 'feedback': {
            await cmd_feedback(interaction, options);
            break;
        }
        case 'channel': {
            await cmd_channel(client, interaction, options);
            break;
        }
        case 'changelog': {
            await cmd_dm_changelog(client, interaction, options);
            break;
        }
        default: {
            return;
        }
    }
    await logCommand(interaction)

});

client.on('ready', async () => {



    const commands = Constants.SLASH_COMMANDS;

    for (let i = 0; i < commands.length; i++) {

        const commandBuilder = buildSlashCommand(commands[i]);

        client.application.commands.create(commandBuilder).then((response) => {
            console.log("Created slash command /" + response.name + " (" + response.id + ")");
        });
    }
    Utils.log("Discord bot ready !");
});