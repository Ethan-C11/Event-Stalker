const {db} = require("../../config");
const {stalker_events, stalker_webhooks_table} = require("../../db/schema");
const {eq} = require("drizzle-orm");
const {eventDataTreatmentService} = require("./eventDataTreatmentService");
const {getEventDetailsService} = require("./getEventDetailsService");
const {sendEventToDiscordWebhookHandler} = require("./discordWebhookService");

async function pollingService() {
    try{
        const events = await db.select()
            .from(stalker_events);

        if(events.length === 0)
            return;

        for (const event of events) {
            const data = await getEventDetailsService(event.organizationSlug, event.formSlug);
            if(data.state !== 'Public')
                continue;
            else
            {
                await db.delete(stalker_events).where(eq(stalker_events.id, event.id));
                return sendEventToDiscordWebhookHandler(data)
            }
        }
    } catch(error) {
        throw error;
    }

}

module.exports = { pollingService: pollingService };