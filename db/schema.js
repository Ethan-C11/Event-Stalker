const { sqliteTable, text, int } = require('drizzle-orm/sqlite-core');

const stalker_webhooks_table = sqliteTable('stalker_webhooks_table', {
    id: int().primaryKey({ autoIncrement: true }),
    organizationSlug : text().notNull(),
    webhookId : text().notNull(),
    webhookToken : text().notNull(),
    guildId: text().notNull()
})

const stalker_events = sqliteTable('stalker_events', {
    id: int().primaryKey({ autoIncrement: true }),
    organizationSlug : text().notNull(),
    formSlug: text().notNull(),
})

const tokens_db = sqliteTable('tokens_db', {
    id: int().primaryKey({ autoIncrement: true }),
    accessToken : text().notNull(),
    refreshToken: text().notNull(),
    tokenType : text().notNull(),
    creationDate: text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
    expireInSeconds: int().notNull(),
})

module.exports = {stalker_webhooks_table, stalker_events, tokens_db}