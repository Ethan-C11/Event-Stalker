if (!process.env.TOKEN) {
    require('dotenv').config();
}
const Database = require('better-sqlite3')
const {drizzle} = require("drizzle-orm/better-sqlite3");
const sqliteDb = new Database(`db/${process.env.DB_FILENAME}`);
const stalker_webhooks_table = require('./db/schema');

const db = drizzle(sqliteDb, { stalker_webhooks_table });


module.exports = {
    env: process.env.ENV,
    token: process.env.TOKEN ,
    clientId: process.env.CLIENT_ID ,
    guildId: process.env.GUILD_ID ,
    helloAssoClientId: process.env.HELLOASSO_CLIENT_ID,
    helloAssoClientSecret: process.env.HELLOASSO_CLIENT_SECRET,
    helloAssoUrl: process.env.HELLOASSO_URL,
    dbFileName: process.env.DB_FILENAME,
    webhooksUrl: process.env.WEBHOOKS_URL,
    isPartner: (process.env.IS_PARTNER.toUpperCase() === 'TRUE'),
    organizationSlug: process.env.ORGANIZATION_SLUG,
    db: db,

};