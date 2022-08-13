const mysql = require('mysql2');
const Utils = require('../functions/utils');


async function keepCorrectIdGames() {

    const query = 'SELECT id, id_item, str_label, int_occurrence FROM free_games as FG WHERE EXISTS (SELECT 1 FROM free_games as F WHERE F.str_label = FG.str_label AND F.id <> FG.id);';
    let [games] = await global.db.query(query);

    if (games.length === 0) {
        Utils.log("No duplicated games in the database.");
        return;
    }

    let toBeRemoved = [];
    let toBeKept = [];

    Utils.log(games);
    for (let i = 0; i < games.length; i++) {
        if (games[i].id_item.contains("-")) {
            toBeRemoved.push(games[i]);
        } else {
            toBeKept.push(games[i]);
        }
    }
    
    if (toBeRemoved.length === 0) {
        Utils.log("Duplicated game found but no invalid id.");
        return;
    }

    for (let i = 0; i < toBeKept.length; i++) {
        let new_occurrence = toBeKept[i].int_occurrence;
        for (let k = 0; k < toBeRemoved.length; k++) {
            if (toBeKept[i].str_label === toBeRemoved[k].str_label) {
                new_occurrence += toBeRemoved[k].int_occurrence;
            }
        }
        let update_query = `UPDATE free_games SET int_occurrence = ${new_occurrence} WHERE id = ${toBeKept[i].id};`;
        Utils.log(update_query);
        await global.db.query(update_query);
    }


    let rm_query = 'DELETE FROM free_games WHERE id in (';
    for (let i = 0; i < toBeRemoved.length; i++) {
        rm_query += toBeRemoved[i] + (i < toBeRemoved.length - 1 ? ", " : ");");
    }
    Utils.log(rm_query);
    await global.db.query(rm_query);
}


async function main() {
    global.db_na = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE,
        connectionLimit: 10,
    });
    global.db = global.db_na.promise();

    await keepCorrectIdGames();
    process.exit(0);
}

main();