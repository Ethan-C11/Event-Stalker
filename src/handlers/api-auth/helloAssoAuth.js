const {helloAssoUrl,
    helloAssoClientId,
    helloAssoClientSecret} = require("../../../config");

async function getTokens() {
    if (!helloAssoUrl || !helloAssoClientId || !helloAssoClientSecret) {
        throw new Error('Variables d\'environnement HelloAsso non définies');
    }

    const url = `${helloAssoUrl}/oauth2/token`;

    const params = new URLSearchParams();
    params.append('client_id', helloAssoClientId);
    params.append('client_secret', helloAssoClientSecret);
    params.append('grant_type', 'client_credentials');

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: params
        });

        const textResponse = await res.text();

        if (!res.ok) {
            console.error(`Détails de l'erreur (${res.status}):`, textResponse);
            throw new Error(`Erreur HTTP ${res.status}: ${textResponse}`);
        }

        // On ne parse que si on est sûr que c'est du succès
        const data = JSON.parse(textResponse);
        console.log('Tokens récupérés avec succès');
        return data;

    } catch (err) {
        console.error('Erreur critique getTokens:', err.message);
        throw err;
    }
}

module.exports = { getTokens };