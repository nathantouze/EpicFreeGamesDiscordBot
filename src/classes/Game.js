const Utils = require('../functions/utils');
const Constants = require('./Constants');
const axios = require('axios').default;

class Game {
    constructor(label, id_launcher, id_item, namespace, link, og_price, date_start, date_end) {
        this._id = null;
        this._label = label;
        this._id_launcher = id_launcher;
        this._occurrence = 1;
        this._id_item = id_item;
        this._namespace = namespace;
        this._link = link;
        this._og_price = og_price;
        this._date_start = date_start;
        this._date_end = date_end;
        this._date_creation = new Date();
    }

    getId() {
        return this._id;
    }

    getLabel() {
        return this._label;
    }

    getIdLauncher() {
        return this._id_launcher;
    }

    getOccurrence() {
        return this._occurrence;
    }

    getIdItem() {
        return this._id_item;
    }

    getNamespace() {
        return this._namespace;
    }

    getLink() {
        return this._link;
    }

    getPurchaseLink() {
        return Constants.EPIC_PURCHASE_1 + this.getNamespace() + "-" + this.getIdItem() + Constants.EPIC_PURCHASE_2;
    }

    getOgPrice() {
        return this._og_price;
    }

    getDateStart() {
        return this._date_start;
    }

    getDateEnd() {
        return this._date_end;
    }

    getDateCreation() {
        return this._date_creation;
    }

    async InitIdFromItem() {
        const query = `\
        SELECT \
            id \
        FROM \
            free_games \
        WHERE \
            id_item = ${global.db.escape(this.getIdItem())};`;
        let [rows] = await global.db.query(query);

        if (rows.length === 0) {
            return;
        }
        this._id = rows[0].id;
    }

    async initFromId(id) {
        const query = `
        SELECT \
            str_label, \
            id_launcher, \
            int_occurrence, \
            id_item, \
            namespace, \
            str_link, \
            og_price, \
            date_end, \
            date_start, \
            date_creation \
        FROM \
            free_games \
        WHERE \
            id = ${global.db.escape(id)};`;

        let [rows] = await global.db.query(query);
        if (rows.length > 0) {
            this._id = id;
            this._label = rows[0].str_label;
            this._id_launcher = rows[0].id_launcher;
            this._occurrence = rows[0].int_occurrence;
            this._id_item = rows[0].id_item;
            this._namespace = rows[0].namespace;
            this._link = rows[0].str_link;
            this._og_price = rows[0].og_price;
            this._date_start = rows[0].date_start;
            this._date_end = rows[0].date_end;
            this._date_creation = rows[0].date_creation;
            return true;
        } else {
            return false;
        }
    }


    /**
     * Fetch the thumbnail of the game from the graphQL API
     * @returns {Promise<string>} The thumbnail URL
     */
    async fetchThumbnailFromAPI() {
        
        return new Promise(async (resolve, reject) => {

            const dataToSend = {
                local: "en-US",
                country: "FR",
                offerId: String(this._id_item),
                sandboxId: this._namespace
            };
            const extensionToSend = {
                persistedQuery: {
                    version: 1,
                    sha256Hash: "6797fe39bfac0e6ea1c5fce0ecbff58684157595fee77e446b4254ec45ee2dcb" // This hash is the same for all requests.
                }
            }
            if (this._namespace === "") {
                Utils.log(`Cannot find the thumbnail for the game ${this._id_item} (name: ${this._label}) in the Epic Games API. (namespace is empty)`);
                resolve(null);
                return;
            }

            const url = `${Constants.EPIC_GRAPHQL}?operationName=getCatalogOffer&variables=${JSON.stringify(dataToSend)}&extensions=${JSON.stringify(extensionToSend)}`;
    
            axios.get(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
                }
            }).then((response) => {


                const data = response.data?.data?.Catalog?.catalogOffer;

                if (data === undefined) {
                    Utils.log(`Cannot find the thumbnail for the game ${this._id_item} (namespace: ${this._namespace}) in the Epic Games API. GraphQL response: ${JSON.stringify(response.data)}`);
                    return;
                }
                const keyImages = data.keyImages;
                if (!Array.isArray(keyImages) || keyImages.length === 0) {
                    Utils.log(`Cannot find the thumbnail for the game ${this._id_item} (namespace: ${this._namespace}) in the Epic Games API. (keyImages)`);
                    return;
                }
                keyImages.forEach((keyImage) => {
                    if (keyImage.type === "Thumbnail") {
                        resolve(keyImage.url);
                    }
                });
                resolve(null);
            
            }).catch((err) => {
                Utils.log(`Cannot find the thumbnail for the game ${this._id_item} (namespace: ${this._namespace}) in the Epic Games API. Error: ${err}`);
                resolve(null);
            });
        });

    }

    /**
     * 
     * @param {String} url 
     */
    async placeThumbnailToDatabase(url) {

        const query = ` \
        UPDATE \
            free_games \
        SET \
            str_thumbnail_link = ${global.db.escape(url)} \
        WHERE \
            id = ${this._id};`;
        await global.db.query(query);
    }

    /**
    * Add the object to the database
    */
    async addToDatabase() {
        let query = 'SELECT id, int_occurrence, date_creation FROM free_games WHERE str_label = ? AND id_launcher = ?;';
        let [rows] = await global.db.query(query, [this.getLabel(), this.getIdLauncher()]);

        if (rows.length > 0) {
            Utils.log("This game was already present this the database. Adding an occurrence...");
            
            query = "UPDATE free_games SET int_occurrence = ?, id_item = ?, namespace = ? WHERE id = ?;";
            await global.db.query(query, [rows[0].int_occurrence + 1, this.getIdItem(), this.getNamespace(), rows[0].id]);
            this._occurrence = rows[0].int_occurrence + 1;
            this._id = rows[0].id;
            this._date_creation = new Date(rows[0].date_creation);
        } else {
            Utils.log("First time the bot sees that game. Adding to the database...");
            
            query = "INSERT INTO free_games (str_label, id_launcher, int_occurrence, id_item, namespace, str_link, og_price, date_start, date_end) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";
            let [rows] = await global.db.query(query, [this.getLabel(), this.getIdLauncher(), 1, this.getIdItem(), this.getNamespace(), this.getLink(), this.getOgPrice(), this.getDateStart(), this.getDateEnd()]);
            this._occurrence = 1;
            this._id = rows.insertId;
            this._date_creation = new Date();
        }
        await global.db.query("INSERT INTO free_games_schedule (id_game, date_start, date_end) VALUES (?, ?, ?);", [this.getId(), this.getDateStart(), this.getDateEnd()]);
    }


    async addToCurrent() {
        const query = 'INSERT INTO free_games_current (id_free_game) VALUES (' + global.db.escape(this._id) + ')';
        await global.db.query(query);
    }

    /**
     * Lists all the currently free games from a launcher
     * @param {number} launcher 
     * @returns 
     */
    static async listAllCurrentGames(launcher) {

        let list = [];
        const query = 'SELECT FG.id, FG.str_label, FG.id_launcher, FG.int_occurrence, FG.id_item, FG.str_link, FG.date_start, FG.date_end ' + 
        'FROM free_games_current FGC INNER JOIN free_games FG ON FG.id = FGC.id_free_game WHERE FG.id_launcher = ' + global.db.escape(launcher);

        let [rows] = await global.db.query(query);
        for (let i = 0; i < rows.length; i++) {
            let game = new Game(rows[i].str_label, launcher, rows[i].id_item, rows[i].str_link, rows[i].date_start, rows[i].date_end);
            game._id = rows[i].id;
            game._occurrence = rows[i].int_occurrence;
            list.push(game);
        }
        return list;
    }

    toJSON() {
        return {
            id: this.getId(),
            label: this.getLabel(),
            item_id: this.getIdItem(),
            link: this.getLink(),
            launcher: this.getIdLauncher(),
            occurrence: this.getOccurrence(),
            date_start: this.getDateStart(),
            date_end: this.getDateEnd(),
            date_creation: this.getDateCreation(),
        }
    }

    dump() {
        Utils.log(
            `
            Game (#${this.getId()}):\n
            Label               :       ${this.getLabel()}\n
            IdItem              :       ${this.getIdItem()}\n
            Store               :       ${Utils.getStoreLabel(this.getIdLauncher())}\n
            Link                :       ${this.getLink()}\n
            Occurrence          :       ${this.getOccurrence()}\n
            Date Start          :       ${this.getDateStart()}\n
            Date End            :       ${this.getDateEnd()}\n
            First Occurrence    :       ${this.getDateCreation()}\n
            `
        );
    }

    getDump() {
        return `
        Game (#${this.getId()}):\n
        Label               :       ${this.getLabel()}\n
        IdItem              :       ${this.getIdItem()}\n
        Store               :       ${Utils.getStoreLabel(this.getIdLauncher())}\n
        Link                :       ${this.getLink()}\n
        Occurrence          :       ${this.getOccurrence()}\n
        Date Start          :       ${this.getDateStart()}\n
        Date End            :       ${this.getDateEnd()}\n
        First Occurrence    :       ${this.getDateCreation()}\n
        `;
    }
}

module.exports = Game;