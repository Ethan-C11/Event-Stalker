const { sqliteTable, text, integer } = require('drizzle-orm/sqlite-core');

export const eventStalkerWebhooks = sqliteTable('eventStalkerWebhooks', {
    id: text('id').primaryKey(),
    guildId : text('guildId'),
    channelId : text('channelId'),
    organizationSlug : text('organizationSlug'),
    webhookId : text('webhookId'),
    webhookUrl : text('webhookUrl'),
})