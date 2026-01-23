const { helloAssoUrl } = require("../../config");
const EventDetailsDTO = require("../objects/dtos/eventDetailsDto");
const { getTokens } = require("./api-auth/helloAssoAuth");
const {EmbedBuilder} = require("discord.js");
const {detailsEmbedBuilder} = require("../utils/detailsEmbedBuilder");

async function detailsDataTreatment(associationSlug, eventSlug) {
    try {
        const tokens = await getTokens();
        if (!tokens || !tokens.access_token) {
            return interaction.editReply("Impossible de récupérer le token d'accès HelloAsso.");
        }
        const url = `${helloAssoUrl}/v5/organizations/${associationSlug}/forms/Event/${eventSlug}/public`;

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${tokens.access_token}`
            }
        });

        if (!res.ok) throw new Error(`Erreur HTTP HelloAsso: ${res.status}`);

        const jsonBody = await res.json();
        console.log(jsonBody);

        return detailsEmbedBuilder(jsonBody);

    } catch (error) {
    console.error(error);
        throw error;
    }
}


module.exports = { detailsDataTreatment };