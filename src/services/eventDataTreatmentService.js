
const {detailsEmbedBuilder} = require("../utils/detailsEmbedBuilder");
const {getEventDetailsService} = require("./getEventDetailsService");

async function eventDataTreatmentService(associationSlug, eventSlug) {
    try {
        const eventDetails = await getEventDetailsService(associationSlug,eventSlug)
        return await detailsEmbedBuilder(eventDetails);

    } catch (error) {
    console.error(error);
        throw error;
    }
}


module.exports = { eventDataTreatmentService: eventDataTreatmentService };