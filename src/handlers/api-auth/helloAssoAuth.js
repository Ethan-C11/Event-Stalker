const { HelloAssoTokenDto } = require("../../objects/dtos/helloAssoTokenDto");
const { HELLOASSO_URL, HELLOASSO_CLIENT_ID, HELLOASSO_CLIENT_SECRET} = process.env;

async function getTokens() {
    if (!HELLOASSO_URL || !HELLOASSO_CLIENT_ID || !HELLOASSO_CLIENT_SECRET) {
        throw new Error('Variables d\'environnement HelloAsso non définies');
    }

    const url = `${HELLOASSO_URL}/token`;

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', HELLOASSO_CLIENT_ID);
    params.append('client_secret', HELLOASSO_CLIENT_SECRET);

    const options = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    };

    try {
        const res = await fetch(url, options);

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(`Erreur HelloAsso: ${res.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await res.json();
        console.log('Tokens récupérés avec succès');
        return data;
    } catch (err) {
        console.error('Erreur lors de la récupération du token:', err);
        throw err;
    }
}

module.exports = { getTokens };

