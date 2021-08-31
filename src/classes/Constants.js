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
    }
})