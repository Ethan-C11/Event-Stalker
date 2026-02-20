const {db} = require("../../config");
const {stalker_events} = require("../../db/schema");
const {eq} = require("drizzle-orm");
const {eventDataTreatmentService} = require("./eventDataTreatmentService");
const {getEventDetailsService} = require("./getEventDetailsService");

async function pollingService() {
    // intégrer le polling régulier

    const events = await db.select()
        .from(stalker_events);

    for (const event of events) {
       const data = await getEventDetailsService(event.organizationSlug, event.formSlug);
       if(data.state !== 'Public')
           continue;

    }
}