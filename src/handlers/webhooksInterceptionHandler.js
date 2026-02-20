const {detailsEmbedBuilder} = require("../utils/detailsEmbedBuilder");
const {stalker_webhooks_table, stalker_events} = require("../../db/schema");
const {db} = require("../../config");
const {eq} = require("drizzle-orm");
const { WebhookClient } = require("discord.js");
const {sendEventToDiscordWebhookHandler} = require("./sendEventToDiscordWebhookHandler");

async function webhooksInterceptionHandler(body) {
    const data = body.data
    if(body.eventType !== "From" || data.formType !== "Event")
        return
    if(!data.tiers || data.tiers.length === 0 || data.state === 'Draft')
    {
        db.insert(stalker_events).values({
            organizationSlug: data.organizationSlug,
            formSlug: data.formSlug,
            }
        )
        return;
    }

    await sendEventToDiscordWebhookHandler(data)
}

module.exports = { webhooksInterceptionHandler };

 /**
  * Exemple de JSON : {
  *     "data": {}
  *     "eventType" : "Form"
  * }
  */