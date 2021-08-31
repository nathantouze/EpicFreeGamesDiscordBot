const axios = require('axios').default;
const Constants = require('./Constants');
const Game = require('./Game');
const { parser } = require('node-html-parser');


class SteamStore {
    constructor() {}

    async getFreeGames() {

        let html_raw = await axios.get(Constants.STEAMDB_FREE_ENDPOINT);
        console.log(html_raw);
    }
}

module.exports = SteamStore;