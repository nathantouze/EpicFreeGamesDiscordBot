const axios = require('axios').default;
const Constants = require('./Constants');
const Game = require('./Game');
const Utils = require('../functions/utils');


class EpicStore {
    constructor() {}

    /**
     * Get all the currently free games from Epic Game and returns an array of it.
     * @returns {Promise<Game[]>}
     */
    async getFreeGames() {

        Utils.log("Fetching the games given on the EPIC GAMES store...");

        let games_raw;

        let games_current_old = await Game.listAllCurrentGames(Constants.LAUNCHER.EPIC);
        let current_old_ids = [];
        for (let i = 0; i < games_current_old.length; i++) {
            current_old_ids.push(games_current_old[i].getIdItem());
        }

        let games_current = [];
        await this.cleanCurretlyFreeGames();
        await axios.get(Constants.EPIC_FREE_ENDPOINT).then((response) => {
            games_raw = response.data.data.Catalog.searchStore.elements;
        });
        for (let i = 0; i < games_raw.length; i++) {
            if (this.isValidStruct(games_raw[i])) {

                let start;
                let end;
                if (games_raw[i].promotions) {
                    [start, end] = this.getPromoPeriod(games_raw[i].promotions);
                }

                let current = new Game(
                    games_raw[i].title, 
                    Constants.LAUNCHER.EPIC, 
                    games_raw[i].id, 
                    this.getFreeGameUrl(games_raw[i]),
                    this.getFreeGameOgPrice(games_raw[i]),
                    start,
                    end
                );
                if (!current_old_ids.includes(games_raw[i].id)) {
                    Utils.log("New game found");
                    await current.addToDatabase();
                    await current.addToCurrent();
                    games_current.push(current);
                } else {
                    Utils.log("Game found but already registered yesterday");
                    await current.InitIdFromItem();
                    await current.initFromId(current.getId());
                    await current.addToCurrent();
                }
                current.dump();
            }
        }
        return games_current;
    }


    /**
     * Get the period of the promotion
     * @param {JSON} promotion 
     * @returns {[Date, Date]}
     */
    getPromoPeriod(promotion) {
        if (!promotion.promotionalOffers) {
            return [null, null];
        }
        for (let i = 0; i < promotion.promotionalOffers.length; i++) {
            let promoOfferSt = promotion.promotionalOffers[i];
            if (promoOfferSt.startDate && promoOfferSt.endDate) {
                return [new Date(promoOfferSt.startDate), new Date(promoOfferSt.endDate)];
            } else if (promoOfferSt.promotionalOffers) {
                for (let k = 0; k < promoOfferSt.promotionalOffers.length; k++) {
                    let promoOfferNd = promoOfferSt.promotionalOffers[k];
                    if (promoOfferNd.startDate && promoOfferNd.endDate) {
                        return [new Date(promoOfferNd.startDate), new Date(promoOfferNd.endDate)];
                    }
                }
            }
        }
        return [null, null];
    }


    /**
     * Gets the original price of the given game.
     * @param {JSON} game 
     * @returns {Number}
     */
    getFreeGameOgPrice(game) {
        let og_price = game.price.totalPrice.originalPrice;

        if (typeof(og_price) === 'number' && og_price > 0) {
            return og_price / 100;
        } else {
            return 0;
        }
    }


    /**
     * Crafts the url of the game
     * @param {JSON} game 
     * @returns {String}
     */
    getFreeGameUrl(game) {
        if (game.productSlug != null) {
            return Constants.EPIC_PRODUCT_ENDPOINT + '/' + game.productSlug;
        } else if (Utils.isNonEmptyArray(game.offerMappings) && game.offerMappings[0].pageSlug != null) {
            return Constants.EPIC_PRODUCT_ENDPOINT + '/' + game.offerMappings[0].pageSlug;
        } else if (game.catalogNs != null && Utils.isNonEmptyArray(game.catalogNs.mappings) && game.catalogNs.mappings[0].pageSlug != null) {
            return Constants.EPIC_PRODUCT_ENDPOINT + '/' + game.catalogNs.mappings[0].pageSlug;
        } else {
            return "Error";
        }
    }

    /**
     * Check the json structure of game
     * @param {JSON} game 
     * @returns {Boolean}
     */
    isValidStruct(game) {
        if (!(game.price && game.price.totalPrice && game.price.totalPrice.discountPrice === 0 && 
            game.price.totalPrice.originalPrice > 0)) {
            return false;
        }
        return true;
    }


    async cleanCurretlyFreeGames() {
        Utils.log("Clearing the games of yesterday from the \"free_games_current\" table");
        const query = 'DELETE FGC FROM free_games_current FGC INNER JOIN free_games FG ON FGC.id_free_game = FG.id WHERE FG.id_launcher = ' + global.db.escape(Constants.LAUNCHER.EPIC);
        await global.db.query(query);
    }
}

module.exports = EpicStore;