require('dotenv').config();

module.exports = Object.freeze({
    DISCORD_TOKEN: process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN : null,
    EPIC_FREE_ENDPOINT: 'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions',
    EPIC_PRODUCT_ENDPOINT: 'https://www.epicgames.com/store/fr/product',
    STEAMDB_FREE_ENDPOINT: 'https://steamdb.info/upcoming/free/',
    STEAM_PRODUCT_PAGE_ENDPOINT: 'https://store.steampowered.com/app',
    STEAM_PRODUCT_INFO_ENDPOINT: 'https://store.steampowered.com/api/appdetails/?appids=',
    LAUNCHER: {
        STEAM: 1,
        EPIC: 2
    },
    LOG_TYPE: {
        ERROR: 'error',
        NEW_GUILD: 'new_guild',
        NEW_TEXT_CHANNEL: 'new_text_channel',
        NEW_FREE_GAME: 'new_free_game',
        COMMAND: 'command',
        DL_LOG: 'logs_download',
        OTHER: 'other',
    },

    COMMANDS: {
        prefix: "!",
        cmd: [
            {
                name: "total",
                proto: "!total",
                description: "Affiche la somme totale (€) des jeux Epic Games donnés.",
                inline: true,
            },
            {
                name: "now",
                proto: "!now",
                description: "Affiche le (ou les) jeu donnés en ce moment sur l'Epic Games Store.",
                inline: true,
            },
            {
                name: "list",
                proto: "!list [from] [to]",
                description: "Liste les jeux donnés sur un temps donné. `from` et `to` sont des dates sous la forme jj/mm/aaaa.",
                inline: true,
            },
            {
                name: "channel",
                proto: "!channel CHANNEL_ID",
                description: "Change le channel d'envois de la notification de jeu gratuit (Admin).",
                inline: true,
            },
            {
                name: "language",
                proto: "!language en|fr",
                description: "Permet de changer la langue du bot (Admin).",
                inline: true
            },
            {
                name: "help",
                proto: "!help",
                description: "Affiche le message d'aide des commandes.",
                inline: true,
            },
            {
                name: "info",
                proto: "!info GAME_ID",
                description: "Affiche les informations du jeu relatives au bot.",
                inline: true,
            }
        ]
    },
    COMMAND_ID: {
        NONE: 0,
        TOTAL: 1,
        NOW: 2,
        LIST: 3,
        CHANNEL: 4,
        LANGUAGE: 5,
        HELP: 6,
        INFO: 7,
    },
})