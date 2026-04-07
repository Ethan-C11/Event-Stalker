const {detailsEmbedBuilder} = require("../utils/detailsEmbedBuilder");
const {stalker_webhooks_table} = require("../../db/schema");
const {db} = require("../../config");
const {eq} = require("drizzle-orm");
const { WebhookClient } = require("discord.js");

async function discordWebhookService(data) {

    const relevantWebhooks = await db.select()
        .from(stalker_webhooks_table)
        .where(eq(stalker_webhooks_table.organizationSlug, data.organizationSlug ));

    const embed = await detailsEmbedBuilder(data, false);
    const descOnlyEmbed = await detailsEmbedBuilder(data, true)

    for (const element of relevantWebhooks) {
        const webhookClient = new WebhookClient({
            id: element.webhookId.toString(),
            token: element.webhookToken.toString(),
        });

        let embedToSend;
        if(element.descOnly === 1)
            embedToSend = descOnlyEmbed;
        else embedToSend = embed;

        await webhookClient.send({
            embeds: [embedToSend],
            avatarURL: 'https://i.imgur.com/soSow0B.png'
        });
    }
}

module.exports = { sendEventToDiscordWebhookHandler: discordWebhookService };
