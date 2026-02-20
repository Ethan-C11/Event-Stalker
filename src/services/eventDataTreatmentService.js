
const {detailsEmbedBuilder} = require("../utils/detailsEmbedBuilder");
const {getEventDetailsService} = require("./getEventDetailsService");

async function eventDataTreatmentService(associationSlug, eventSlug) {
    try {
        const eventDetails = await getEventDetailsService(associationSlug,eventSlug)
        const embed = await detailsEmbedBuilder(eventDetails);
        console.log(embed);
        return embed;

    } catch (error) {
    console.error(error);
        throw "dataTreatment: " + error;
    }
}


module.exports = { eventDataTreatmentService: eventDataTreatmentService };