const Discord = require('discord.js');
const client = new Discord.Client();

const Constants = require('./classes/Constants');
const EpicStore = require('./classes/EpicStore');

let connected = false;
var epic = new EpicStore();

function getGeneralChannel(client) {
    let channel = client.channels.cache.find(channels => channels.name == 'général');
    if (channel == undefined)
        channel = client.channels.cache.find(channels => channels.name == 'general');
    return channel;
}


client.once('ready', async () => {
    console.log('Connected');
    connected = true;
    var links = await epic.getFreeGame();
    let channel = getGeneralChannel(client);
    if (channel == undefined)
        process.exit();
    await channel.send('Hello !');
});

client.login(Constants.DISCORD_TOKEN);