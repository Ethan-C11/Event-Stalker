const {webhooksUrl, helloAssoUrl, isPartner, organizationSlug} = require("../../config");
const {getTokens} = require("./helloAssoAuthService");


async function notificationUrlSetupService() {

    const tokens = await getTokens();
    if (!tokens || !tokens.access_token) {
        throw new Error("Impossible de récupérer le token d'accès HelloAsso.");
    }

    let url = `${helloAssoUrl}/v5/partners/me/api-notifications`;
    if(isPartner === false){
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

module.exports = { notificationUrlSetupService: notificationUrlSetupService };