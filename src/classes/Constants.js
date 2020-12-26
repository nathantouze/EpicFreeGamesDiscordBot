require('dotenv').config();

module.exports = Object.freeze({
    DISCORD_TOKEN: process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN : null,
    FREEGAMES_ENDPOINT: 'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions',
    EPIC_PRODUCT_ENDPOINT: 'https://www.epicgames.com/store/fr/product',
    EPIC_PRODUCT_STARTUP: process.env.EPIC_PRODUCT_STARTUP ? process.env.EPIC_PRODUCT_STARTUP : null,
})