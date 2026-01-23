const {webhooksUrl, helloAssoUrl} = require("../../config");
const {getTokens} = require("./api-auth/helloAssoAuth");


async function setupNotificationUrl() {

    const tokens = await getTokens();
    if (!tokens || !tokens.access_token) {
        return interaction.editReply("Impossible de récupérer le token d'accès HelloAsso.");
    }

    const bodyJson = JSON.parse(`{"url": "${webhooksUrl}", "notificationType": "Form"}`)

    console.log(bodyJson);
    const url = `${helloAssoUrl}/v5/partners/me/api-notifications`;
    const options = {
        method: 'PUT',
        headers: {
            'accept': 'application/*+json',
            'Authorization': `Bearer ${tokens.access_token}`
        },
        body: bodyJson
    };

    fetch(url, options)
        .then(res => console.log(res))
        .catch(err => console.error(err));
}

module.exports = { setupNotificationUrl };