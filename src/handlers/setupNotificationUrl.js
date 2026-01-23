const {webhooksUrl, helloAssoUrl, isPartner, organizationSlug} = require("../../config");
const {getTokens} = require("./api-auth/helloAssoAuth");


async function setupNotificationUrl() {

    const tokens = await getTokens();
    if (!tokens || !tokens.access_token) {
        throw new Error("Impossible de récupérer le token d'accès HelloAsso.");
    }

    let url = `${helloAssoUrl}/v5/partners/me/api-notifications`;
    console.log(isPartner);
    if(isPartner === false){
        console.log('partner is false')
        url = url.concat(`/organizations/${organizationSlug}`) ;
    }


    const options = {
        method: 'PUT',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: `Bearer ${tokens.access_token}`
        },
        body: `{"url": "${webhooksUrl}", "notificationType": "Form"}`
    };

    fetch(url, options)
        .then(res => console.log(res))
        .catch(err => console.error(err));
}

module.exports = { setupNotificationUrl };