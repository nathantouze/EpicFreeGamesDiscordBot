class User {

    constructor () {}

    async initFromDbID(id) {
        const query = `\
        SELECT \
            username, \
            id_user, \
            language, \
            creation_date \
        FROM \
            bot_dm_channels \
        WHERE \
            id = ${global.db.escape(id)};`;
        let [rows] = await global.db.query(query);
        
        if (rows.length === 0) {
            return false;
        }
        this.id = id;
        this.username = rows[0].username;
        this.id_user = rows[0].id_user;
        this.language = rows[0].language;
        this.creation_date = new Date(rows[0].creation_date);
        return true;
    }

    async init(id) {
        const query = `\
        SELECT \
            id, \
            username, \
            language, \
            creation_date \
        FROM \
            bot_dm_channels \
        WHERE \
            id_user = ${global.db.escape(id)};`;
        let [rows] = await global.db.query(query);

        if (rows.length === 0) {
            return false;
        }
        this.id = rows[0].id;
        this.username = rows[0].username;
        this.id_user = id;
        this.language = rows[0].language;
        this.creation_date = new Date(rows[0].creation_date);
        return true;
    }

    async create(id_user, username, language) {
        let query = `\
            INSERT INTO \
                bot_dm_channels (\
                    id_user, \
                    username, \
                    language \
                ) \
            VALUES (\
                ${global.db.escape(id_user)}, \
                ${global.db.escape(username)}, \
                ${global.db.escape(language)} \
            );`;
        let [rows] = await global.db.query(query);
        this.id = rows.insertId;
        this.id_user = id_user;
        this.username = username;
        this.language = language;
        this.creation_date = new Date();
        return true;
    }

    toJSON() {
        return {
            id: this.id,
            id_user: this.id_user,
            username: this.username,
            language: this.language,
            creation_date: this.creation_date
        };
    }
}

module.exports = User;