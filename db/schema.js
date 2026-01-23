const { sqliteTable, text, int } = require('drizzle-orm/sqlite-core');

export const eventStalkerWebhooks = sqliteTable('stalker_webhooks_table', {
    id: int().primaryKey({ autoIncrement: true }),
    guildId : text().notNull(),
    channelId : text().notNull(),
    organizationSlug : text().notNull(),
    webhookId : text().notNull(),
    webhookUrl : text().notNull(),
})