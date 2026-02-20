const {stalker_events} = require("../../db/schema");
const {db} = require("../../config");
const {sendEventToDiscordWebhookHandler} = require("./discordWebhookService");

async function webhooksInterceptionService(body) {
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

module.exports = { webhooksInterceptionHandler: webhooksInterceptionService };

 /**
  * Exemple de JSON : {
  *     "data": {}
  *     "eventType" : "Form"
  * }
  */