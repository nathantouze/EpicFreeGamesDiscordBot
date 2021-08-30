const axios = require('axios').default;
const Constants = require('./Constants');
const Game = require('./Game');


class EpicStore {
    constructor() {}

    /**
     * Get all the currently free games from Epic Game and returns an array of it.
     * @returns {Promise<Game[]>}
     */
    async getFreeGames() {
        let games_raw;

        let games_current_old = await Game.listAllCurrentGames(Constants.LAUNCHER.EPIC);
        let current_old_ids = [];
        for (let i = 0; i < games_current_old.length; i++) {
            current_old_ids.push(games_current_old[i].getIdItem());
        }

        let games_current = [];
        await this.cleanCurretlyFreeGames();
        await axios.get(Constants.FREEGAMES_ENDPOINT).then((response) => {
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
                    start,
                    end
                );
                if (!current_old_ids.includes(games_raw[i].id)) {
                    await current.addToDatabase();
                    await current.addToCurrent();
                    games_current.push(current);
                } else {
                    await current.InitIdFromItem();
                    await current.addToCurrent();
                }
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
     * Crafts the url of the game
     * @param {JSON} game 
     * @returns {String}
     */
    getFreeGameUrl(game) {
        return Constants.EPIC_PRODUCT_ENDPOINT + '/' + game.productSlug;
    }

    /**
     * Check the json structure of game
     * @param {JSON} game 
     * @returns {Boolean}
     */
    isValidStruct(game) {
        if (
            !game.title || !game.id ||
            (game.productSlug === '[]' || !game.productSlug) ||
            (!game.price || !game.price.totalPrice) ||
            (!game.promotions || !game.promotions.promotionalOffers || 
            game.promotions.promotionalOffers.length === 0)
        ) {
            return false;
        }
        return true;
    }


    async cleanCurretlyFreeGames() {
        const query = 'DELETE FGC FROM free_games_current FGC INNER JOIN free_games FG ON FGC.id_free_game = FG.id WHERE FG.id_launcher = ' + global.db.escape(Constants.LAUNCHER.EPIC);
        await global.db.query(query);
    }
}

module.exports = EpicStore;