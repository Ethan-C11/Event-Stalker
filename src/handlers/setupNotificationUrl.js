const {webhooksUrl, helloAssoUrl, isPartner, organizationSlug} = require("../../config");
const {getTokens} = require("./api-auth/helloAssoAuth");


async function setupNotificationUrl() {

    const tokens = await getTokens();
    if (!tokens || !tokens.access_token) {
        return interaction.editReply("Impossible de récupérer le token d'accès HelloAsso.");
    }

    let url = `${helloAssoUrl}/v5/partners/me/api-notifications`;
    if(!isPartner)
       url = url.concat(`/organizations/${organizationSlug}`) ;


    const bodyJson = JSON.parse(`{"url": "${webhooksUrl}", "notificationType": "Form"}`)

    const options = {
        method: 'PUT',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${tokens.access_token}`
        },
        body: bodyJson
    };

    fetch(url, options)
        .then(res => console.log(res))
        .catch(err => console.error(err));
}

module.exports = { setupNotificationUrl };