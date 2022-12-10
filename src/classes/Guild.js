class Guild {
    constructor() {}

    async initFromDbID(id) {
        const query = `\
        SELECT \
            g.id_guild, \
            g.str_label, \
            g.language, \
            g.creation_date, \
            gtx.id AS txt_channel_id, \
            gtx.str_label AS txt_channel_label, \
            gtx.id_channel, \
            gtx.id_setup_user, \
            gtx.date_creation AS txt_channel_creation_date \
        FROM \
            bot_guilds AS g \
        JOIN bot_guilds_text_channel as gtx ON gtx.id_guild = g.id_guild \
        WHERE \
            g.id = ${global.db.escape(id)};`;
        let [rows] = await global.db.query(query);
    
        if (rows.length === 0) {
            return false;
        }
        this.id = id;
        this.str_label = rows[0].str_label;
        this.id_guild = rows[0].id_guild;
        this.language = rows[0].language;
        this.creation_date = rows[0].creation_date;
        this.txt_channel = {
            id: rows[0].txt_channel_id,
            str_label: rows[0].txt_channel_label,
            id_channel: rows[0].id_channel,
            id_setup_user: rows[0].id_setup_user,
            creation_date: rows[0].txt_channel_creation_date
        };
        return true;
    }

    async init(id) {

        const query = `\
        SELECT \
            g.id, \
            g.str_label, \
            g.language, \
            g.creation_date, \
            gtx.id AS txt_channel_id, \
            gtx.str_label AS txt_channel_label, \
            gtx.id_channel, \
            gtx.id_setup_user, \
            gtx.date_creation AS txt_channel_creation_date \
        FROM \
            bot_guilds AS g \
        JOIN bot_guilds_text_channel as gtx ON gtx.id_guild = g.id_guild \
        WHERE \
            g.id_guild = ${global.db.escape(id)};`;
        let [rows] = await global.db.query(query);

        if (rows.length === 0) {
            return false;
        }
        this.id = rows[0].id;
        this.str_label = rows[0].str_label;
        this.id_guild = id;
        this.language = rows[0].language;
        this.creation_date = rows[0].creation_date;
        this.txt_channel = {
            id: rows[0].txt_channel_id,
            str_label: rows[0].txt_channel_label,
            id_channel: rows[0].id_channel,
            id_setup_user: rows[0].id_setup_user,
            creation_date: rows[0].txt_channel_creation_date
        };
        return true;
    }

    async create(id_guild, guild_label, channel_label, channel_id, user_id) {
        let query = `\
            INSERT INTO \
                bot_guilds (\
                    id_guild, \
                    str_label, \
                    language, \
                    creation_date\
                ) \
            VALUES \
            ( \
                ${global.db.escape(id_guild)}, \
                ${global.db.escape(guild_label)}, \
                'en', \
                NOW() \
            )\
        `;
        let [rows] = await global.db.query(query);
        this.id = rows.insertId;
        this.str_label = guild_label;
        this.id_guild = id_guild;
        this.language = 'en';
        this.creation_date = new Date();

        query = `\
        INSERT INTO \
            bot_guilds_text_channel \
            (\
                str_label, \
                id_guild, \
                id_channel, \
                id_setup_user\
            ) \
        VALUES \
        (\
            ${global.db.escape(channel_label)}, \
            ${global.db.escape(id_guild)}, \
            ${global.db.escape(channel_id)}, \
            ${global.db.escape(user_id)}\
        );`;
        let [rows_nd] = await global.db.query(query);
        this.txt_channel = {
            id: rows_nd.insertId,
            str_label: channel_label,
            id_channel: channel_id,
            id_setup_user: user_id,
            creation_date: new Date()
        }
    }

    async delete() {

        let query = `\
        DELETE FROM \
            bot_guilds_text_channel \
        WHERE \
            id_guild = ${global.db.escape(this.id_guild)};`;
        await global.db.query(query);

        query = `\
        DELETE FROM \
            bot_guilds \
        WHERE \
            id = ${global.db.escape(this.id)};`;
        await global.db.query(query);
        return true;
    }

    async updateTextChannel(channel_label, channel_id, user_id) {
        let query = `\
        UPDATE \
            bot_guilds_text_channel \
        SET \
            str_label = ${global.db.escape(channel_label)}, \
            id_channel = ${global.db.escape(channel_id)}, \
            id_setup_user = ${global.db.escape(user_id)} \
        WHERE \
            id_guild = ${global.db.escape(this.id_guild)};`;
        await global.db.query(query);
        this.txt_channel.str_label = channel_label;
        this.txt_channel.id_channel = channel_id;
        this.txt_channel.id_setup_user = user_id;
    }

    toJSON() {
        return {
            id: this.id,
            str_label: this.str_label,
            id_guild: this.id_guild,
            language: this.language,
            creation_date: this.creation_date,
            txt_channel: this.txt_channel
        }
    }
}

module.exports = Guild;