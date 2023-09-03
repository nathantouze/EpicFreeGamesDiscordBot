const axios = require('axios').default;
const Constants = require('./Constants');
const { parse } = require('node-html-parser');
const Game = require('./Game');
const Utils = require('../functions/utils');

class GOG {

    constructor() {}


    /**
     * 
     * @param {any} html 
     * @returns {{
     * id: string,
     * endTime: number,
     * background: string,
     * mobileBackground: string,
     * title: string,
     * logo: {
        * image: string,
        * styles: {
            * mobile:{
                * top: string,
                * left: string,
                * width: string,
            * },
            * tablet: {
                * top: string,
                * left: string,
                * width: string,
            * },
            * desktop: {
                * top: string,
                * left: string,
                * width: string,
            * },
     *      },
     * },
     * gameUrl: string,
     * backgroundColour: string,
     * marketingConsetType: string,}}
     */
    extractPromoData(html) {
    
        const root = parse(html);
        const giveaway = root.querySelector('#giveaway');
        const fnText = giveaway._rawAttrs.onclick;
        const regex = /(?<vip>window\.gogTools\.sendPromotionClick\(.*'(?<data>.*))',.*{/gs;
        const array = regex.exec(fnText);

        return JSON.parse(JSON.parse(`"${array.groups.data}"`));
    }

    /**
     * 
     * @param {Number} timestampEnd 
     */
    parseDates(timestampEnd) {
    
        return [new Date(), new Date(timestampEnd)];
    }


    /**
     * Fetch the original price of a game from its id
     * @param {String} gameId 
     * @returns {Promise<Number>}
     */
    async getOgPrice(gameId) {
    
        return new Promise(async (resolve, reject) => {

            axios.get(`${Constants.GOG_API_ENDPOINT}/products/${gameId}/prices?countryCode=FR&currency=EUR`, {
                headers: {
                    'User-Agent': Constants.USER_AGENT
                }
            }).then((response) => {
                try {
                    const priceStr = response.data._embedded.prices[0].basePrice;
                    const price = parseFloat(priceStr) / 100;

                    return resolve(price);
                } catch (error) {
                    Utils.log("Error while fetching price from GOG API (game id: " +  gameId + "): " + error.message);
                    return 0;
                }
            }).catch((error) => {
                Utils.log("Error while fetching price from GOG API (game id: " + gameId + "): " + error.message);
                return 0;
            });
        });
    }

    /**
     * Get GOG game id from its title
     * @param {String} game_title 
     * @returns {Promise<String>}
     */
    async getGameId(game_title) {
        return new Promise(async (resolve, reject) => {
        
            axios.get(Constants.GOG_SEARCH_ENDPOINT + game_title, {
                headers: {
                    'User-Agent': Constants.USER_AGENT
                }
            }).then((response) => {
                for (const game of response.data.products) {
                    if (game.title === game_title) {
                        return resolve(game.id);
                    }
                }
                return resolve(null);
            }).catch((error) => {
                Utils.log("Error while fetching GOG search page: " + error.message);
                return resolve(null);
            });
        });
    }


    /**
     * Fetch the free games from the GOG main page and returns an array of it.
     * @returns {Promise<Game[]>}
     */
    async getFreePromo() {
        return new Promise(async (resolve, reject) => {


            try {

                let game_current = [];
                const list_free_games = await Game.listAllCurrentGames(Constants.LAUNCHER.GOG);
                const list_free_games_ids = [];
                for (let i = 0; i < list_free_games.length; i++) {
                    list_free_games_ids.push(Number(list_free_games[i].getIdItem()));
                }
                await this.cleanCurrentlyFreeGames();

                const html = await axios.get(Constants.GOG_MAIN_ENDPOINT, {
                    headers: {
                        'User-Agent': Constants.USER_AGENT
                    }
                });
                const data = this.extractPromoData(html.data);
                const [dateStart, dateEnd] = this.parseDates(data.endTime);

                const gameId = await this.getGameId(data.title);
                if (gameId == null) {
                    Utils.log("Cannot find the game " + data.title + " in the GOG API.");
                    return resolve([]);
                }

                const og_price = await this.getOgPrice(gameId);

                let current = new Game(
                    data.title,
                    Constants.LAUNCHER.GOG,
                    gameId,
                    "",
                    Constants.GOG_MAIN_ENDPOINT + data.gameUrl,
                    og_price,
                    dateStart,
                    dateEnd,
                );
                if (!list_free_games_ids.includes(gameId)) {
                    Utils.log("New free game found on GOG: " + current.getLabel());
                    await current.addToDatabase();
                    await current.addToCurrent();
                    const thumbnail = Constants.GOG_IMAGE_ENDPOINT + '/' + data.logo.image + '_product_tile_256_2x.png';
                    await current.placeThumbnailToDatabase(thumbnail);
                    game_current.push(current);
                } else {
                    Utils.log("Game " + current.getLabel() + " is already in the database.");
                    await current.InitIdFromItem();
                    await current.initFromId(current.getId());
                    await current.addToCurrent();
                }
                current.dump();
                resolve(game_current);

            } catch (error) {
                Utils.log("Error while fetching GOG main page: " + error.message);
                resolve([]);
            }
        });
    }

    async cleanCurrentlyFreeGames() {
        
        Utils.log("Clearing the games of yesterday from the \"free_games_current\" table (GOG)");

        const query = `
        DELETE FGC FROM 
            free_games_current FGC 
            INNER JOIN free_games FG ON FGC.id_free_game = FG.id 
        WHERE 
            FG.id_launcher = ${global.db.escape(Constants.LAUNCHER.GOG)}`;
        await global.db.query(query);
    }
}


module.exports = GOG;