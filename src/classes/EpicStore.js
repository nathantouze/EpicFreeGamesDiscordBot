const axios = require('axios').default;
const Constants = require('./Constants');


class EpicStore {
    constructor() {}

    async getFreeGame() {
        let games;
        let links = [];

        await axios.get(Constants.FREEGAMES_ENDPOINT).then((response) => {
            games = response.data.data.Catalog.searchStore.elements;
        });
        for (let i = 0; i < games.length; i++) {
            if (this.isNewGame(games[i]) && games[i].title !== "Mystery Game" && this.isValidSlug(games[i]))
                links.push(this.getFreeGameUrl(games[i]));
        }
        this.prev_games = games;
        return links;
    }

    getFreeGameUrl(game) {
        return Constants.EPIC_PRODUCT_ENDPOINT + '/' + game.productSlug;
    }

    isNewGame(game) {
        for (let i = 0; i < this.prev_games; i++) {
            if (this.prev_games[i].id === game.id)
                return false;
        }
        return true;
    }

    isValidSlug(game) {
        if (game.productSlug === '[]' && game.productSlug == null && game.productSlug == undefined)
            return false;
        else
            return true;
    }
}

module.exports = EpicStore;