const { sqliteTable, text, int } = require('drizzle-orm/sqlite-core');

const stalker_webhooks_table = sqliteTable('stalker_webhooks_table', {
    id: int().primaryKey({ autoIncrement: true }),
    organizationSlug : text().notNull(),
    webhookId : text().notNull(),
    webhookToken : text().notNull(),
    guildId: text().notNull()
})

module.exports = {stalker_webhooks_table}