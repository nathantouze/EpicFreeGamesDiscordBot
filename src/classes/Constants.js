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
    COMMAND: ["total", "now", "list", "channel", "language", "help", "info"],
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
    COMMAND_PREFIX: "!",
})