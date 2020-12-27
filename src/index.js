const Discord = require('discord.js');
const client = new Discord.Client();

const Constants = require('./classes/Constants');
const EpicStore = require('./classes/EpicStore');

var epic = new EpicStore();

const timer = sec => new Promise( res => setTimeout(res, sec * 1000));

function getGeneralChannels(client) {
    let guilds = client.guilds.cache.array();
    let channels = [];

    guilds.forEach(element => {
        channels.push(element.channels.cache.find(channel => channel.name == 'général' || channel.name == 'general'));
    });
    return channels;
}


function isJustStarted(links) {
    if (links.find(link => link == Constants.EPIC_PRODUCT_STARTUP) == undefined)
        return false;
    return true;
}


async function prepareFreeGameMessage(epic) {
    let links = await epic.getFreeGame();
    var msg = links.length === 1 ? "Voici le jeu à récupérer sur l'Epic Games Store en ce moment :\n" : "Voici les jeux à récupérer sur l'Epic Games Store en ce moment :\n";

    if (links.length === 0 || isJustStarted(links))
        return null;
    else if (links.length === 1) {
        msg += links[0];
    } else {
        for (let i = 0; i < links.length; i++)
            msg += "<" + links[i] + ">\n";
    }
    return msg;
}


async function sendFreeGameMessage(client, msg) {
    let channels = getGeneralChannels(client);

    if (channels == undefined)
        return;
    channels.forEach(async element => {
        await element.send(msg);
    });
}


client.once('ready', async () => {
    var msg;
    console.log('Connected');
    while (1) {
        let date = new Date();
        
        if (date.getUTCHours() === 1 && date.getUTCMinutes() === 57 && date.getUTCSeconds() === 30) {
            let new_msg = await prepareFreeGameMessage(epic);
            if (new_msg === msg || new_msg == null) {
                msg = new_msg;
                await timer(1);
                continue;
            }
            await sendFreeGameMessage(client, new_msg);
            await timer(1);
            msg = new_msg;
        }
    }
});

client.login(Constants.DISCORD_TOKEN);