const mysql = require('mysql2/promise');
const Game = require('../src/classes/Game');
const Utils = require('../src/functions/utils');


global.db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    connectionLimit: 10,
}).on('connection', async () => {
    Utils.log("Connected to the database !")

});


async function main() {

    const game = new Game();

    // get the first 100 games from the database
    const query = `\
    SELECT\
        FG.id\
    FROM\
        free_games FG\
    WHERE\
        FG.id_launcher = 2\
    LIMIT 100\
    OFFSET 300;
    `
    const [rows] = await global.db.query(query);
    for (let i = 0; i < rows.length; i++) {
        const game = new Game();
        if (!await game.initFromId(rows[i].id)) {
            Utils.log("Error while initializing the game");
            return;
        }
        const url = await game.fetchThumbnailFromEpicAPI();
        if (url === null) {
            Utils.log("Error while fetching the thumbnail:" + game._id);
        } else {
            Utils.log("Thumbnail fetched:" + game._id);
            await game.placeThumbnailToDatabase(url);
        }
        await Utils.sleep(Utils.randomBetween(1000, 7000));
    }
}

main().then(() => {
    process.exit(0);
});