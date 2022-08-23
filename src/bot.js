const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ] 
});
const mysql = require('mysql2/promise');

const { logCommand } = require('./functions/discord_utils');
const Utils = require('./functions/utils');
const Constants = require('./classes/Constants');

const cmd_channel = require('./commands/channel');
const cmd_total = require('./commands/total');
const cmd_now = require('./commands/now');
const cmd_list = require('./commands/list');
const cmd_help = require('./commands/help');
const cmd_info = require('./commands/info');

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



client.on('messageCreate', async (message) => {

    switch (Utils.isCommand(message.content)) {
        case Constants.COMMAND_ID.CHANNEL: {
            logCommand(message);
            await cmd_channel(client, message);
            break;
        }
        case Constants.COMMAND_ID.TOTAL: {
            logCommand(message);
            await cmd_total(message);
            break;
        }
        case Constants.COMMAND_ID.NOW: {
            logCommand(message);
            await cmd_now(message);
            break;
        }
        case Constants.COMMAND_ID.LIST: {
            logCommand(message);
            await cmd_list(message);
            break;
        }
        case Constants.COMMAND_ID.HELP: {
            logCommand(message);
            await cmd_help(message);
            break;
        }
        case Constants.COMMAND_ID.INFO: {
            logCommand(message);
            await cmd_info(message);
            break;
        }
        default: {
            break;
        }
    }
});


client.login(Constants.DISCORD_TOKEN);

client.on('ready', async () => {
    Utils.log("Discord bot ready !");
});