const {detailsEmbedBuilder} = require("../utils/detailsEmbedBuilder");
const {stalker_webhooks_table} = require("../../db/schema");
const {db} = require("../../config");
const {eq} = require("drizzle-orm");
const { WebhookClient } = require("discord.js");

async function webhooksInterceptionHandler(body) {
    const embed =  detailsEmbedBuilder(body.data);

    const relevantWebhooks = await db.select()
        .from(stalker_webhooks_table)
        .where(eq(stalker_webhooks_table.organizationSlug, body.data.organizationSlug ));

    for (const element of relevantWebhooks) {
        const webhookClient = new WebhookClient({
            id: element.webhookId.toString(),
            token: element.webhookToken.toString(),
        });

        await webhookClient.send({
            embeds: [embed],
            avatarURL: 'https://i.imgur.com/soSow0B.png'
        });
    }
}

module.exports = { webhooksInterceptionHandler };

 /**
  * Exemple de JSON : {
  *     "data": {}
  *     "eventType" : "Form"
  * }
  */