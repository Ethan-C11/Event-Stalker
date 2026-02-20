const { helloAssoUrl } = require("../../config");
const { getTokens } = require("./helloAssoAuthService");

async function getEventDetailsService(associationSlug, eventSlug) {
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

        return await res.json();

    } catch (error) {
        console.error(error);
        throw error;
    }
}


module.exports = { getEventDetailsService: getEventDetailsService };