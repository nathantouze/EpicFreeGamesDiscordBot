require('dotenv').config();

module.exports = Object.freeze({
    DISCORD_TOKEN: process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN : null,
    DISCORD_BOT_OWNER: process.env.DISCORD_BOT_OWNER ? process.env.DISCORD_BOT_OWNER : null,
    INVITE_LINK: process.env.DISCORD_BOT_INVITE_LINK ? process.env.DISCORD_BOT_INVITE_LINK : null,
    FEEDBACK_EMAIL: process.env.FEEDBACK_EMAIL ? process.env.FEEDBACK_EMAIL : null,
    FEEDBACK_EMAIL_PASSWORD: process.env.FEEDBACK_EMAIL_PASSWORD ? process.env.FEEDBACK_EMAIL_PASSWORD : null,
    EPIC_PURCHASE_1: "https://store.epicgames.com/purchase?highlightColor=000000&offers=1-",
    EPIC_PURCHASE_2: "&orderId&purchaseToken#/purchase/payment-methods",
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
        GUILD_KICK: 'guild_kick',
        COMMAND: 'command',
        DL_LOG: 'logs_download',
        OTHER: 'other',
    },

    COMMAND_DM: {
        prefix: "!",
        cmd: [
            {
                name: "changelog",
                proto: "!changelog [push|check]",
                description: `CMD_DM_CHANGELOG_DESC`,
                inline: true,
            },
            {
                name: "language",
                proto: "!language en|fr",
                description: `CMD_DM_LANGUAGE_DESC`,
                inline: true,
            },
            {
                name: "help",
                proto: "!help [dm]",
                description: `CMD_HELP_DESC`,
                inline: true,
            },
            {
                name: "invite",
                proto: "!invite",
                description: `CMD_INVITE_DESC`,
                inline: true,
            },
            {
                name: "feedback",
                proto: "!feedback MESSAGE",
                description: `CMD_FEEDBACK_DESC`,
                inline: true,
            }
        ]
    },
    COMMAND_DM_ID: {
        NONE: 0,
        CHANGELOG: 1,
        LANGUAGE: 2,
        HELP: 3,
        INVITE: 4,
        FEEDBACK: 5,
    },
    COMMANDS: {
        prefix: "!",
        cmd: [
            {
                name: "total",
                proto: "!total",
                description: `CMD_TOTAL_DESC`,
                inline: true,
            },
            {
                name: "now",
                proto: "!now",
                description: `CMD_NOW_DESC`,
                inline: true,
            },
            {
                name: "list",
                proto: "!list [from] [to]",
                description: `CMD_LIST_DESC`,
                inline: true,
            },
            {
                name: "channel",
                proto: "!channel CHANNEL_ID",
                description: `CMD_CHANNEL_DESC`,
                inline: true,
            },
            {
                name: "language",
                proto: "!language en|fr",
                description: `CMD_LANGUAGE_DESC`,
                inline: true
            },
            {
                name: "help",
                proto: "!help [dm]",
                description: `CMD_HELP_DESC`,
                inline: true,
            },
            {
                name: "info",
                proto: "!info GAME_ID",
                description: `CMD_INFO_DESC`,
                inline: true,
            },
            {
                name: "invite",
                proto: "!invite",
                description: `CMD_INVITE_DESC`,
                inline: true,
            },
            {
                name: "feedback",
                proto: "!feedback MESSAGE",
                description: `CMD_FEEDBACK_DESC`,
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
        INVITE: 8,
        FEEDBACK: 9,
    },
})