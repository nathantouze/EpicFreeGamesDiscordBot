const mysql = require('mysql2/promise');
const Utils = require('../functions/utils');


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

    Utils.sleep(1000);

    let query = `SELECT id_free_game FROM free_games_current;`;
    const [rows] = await global.db.query(query);
    for (let i = 0; i < rows.length; i++) {
        let id = rows[i].id_free_game;
        query = `SELECT int_occurrence FROM free_games WHERE id = ${id};`;
        let [occurences] = await global.db.query(query);
        let occurence = occurences[0].int_occurrence;
        if (occurence == 1) {
            console.log("Removing game " + id);
            query = `DELETE FROM free_games WHERE id = ${id};`;
            await global.db.query(query);
        } else {
            console.log("Removing occurence " + occurence + " of game " + id);
            occurence--;
            query = `UPDATE free_games SET int_occurrence = ${occurence} WHERE id = ${id};`;
            await global.db.query(query);
        }
        query = `DELETE FROM free_games_schedule WHERE id_game = ${id} ORDER BY id DESC LIMIT 1;`;
        await global.db.query(query);
        query = `DELETE FROM free_games_current WHERE id_free_game = ${id};`;
        await global.db.query(query);
    }
    console.log("Done !");
}

main().then(() => {
    process.exit(0);
});