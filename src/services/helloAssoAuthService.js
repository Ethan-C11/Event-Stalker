const {helloAssoUrl,
    helloAssoClientId,
    helloAssoClientSecret, db
} = require("../../config");
const {tokens_db} = require("../../db/schema");
const {sql, eq} = require("drizzle-orm");

async function getTokens() {
    if (!helloAssoUrl || !helloAssoClientId || !helloAssoClientSecret) {
        throw new Error('Variables d\'environnement HelloAsso non définies');
    }

    const url = `${helloAssoUrl}/oauth2/token`;


    const refreshToken = async (refreshToken, tokenId) => {
        const params = new URLSearchParams();
        params.append('grant_type', 'refresh_token');
        params.append('refresh_token', refreshToken);

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'accept': 'application/json',
                },
                body: params
            });

            const textResponse = await res.text();

            if (!res.ok) {
                console.error(`Détails de l'erreur (${res.status}):`, textResponse);
                throw new Error(`Erreur HTTP ${res.status}: ${textResponse}`);
            }

            const data = JSON.parse(textResponse);
            console.log('Tokens rafraichi avec succès');

            await db.update(tokens_db).set({
                access_token: data.access_token,
                refresh_token: data.refresh_token,
                token: data.token_type,
                expires_in: parseInt(data.expires_in),
                creationDate: sql`(CURRENT_TIMESTAMP)`
            }).where(eq(tokens_db.id, tokenId ))

            return data;

        } catch (err) {
            console.error('Erreur critique refreshTokens:', err.message);
            throw err;
        }
    }

    const getNewToken = async () => {
        const params = new URLSearchParams();
        params.append('client_id', helloAssoClientId);
        params.append('client_secret', helloAssoClientSecret);
        params.append('grant_type', 'client_credentials');

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'accept': 'application/json',
                },
                body: params
            });

            const textResponse = await res.text();

            if (!res.ok) {
                console.error(`Détails de l'erreur (${res.status}):`, textResponse);
                throw new Error(`Erreur HTTP ${res.status}: ${textResponse}`);
            }

            const data = JSON.parse(textResponse);
            console.log('Tokens récupérés avec succès');

            await db.insert(tokens_db).values({
                access_token: data.access_token,
                refresh_token: data.refresh_token,
                token: data.token_type,
                expires_in: parseInt(data.expires_in)
            })

            return data;

        } catch (err) {
            console.error('Erreur critique getTokens:', err.message);
            throw err;
        }
    }

    const token = await db.select()
        .from(tokens_db)
        .where(sql`datetime(${tokens_db.createdAt}, '+' || ${tokens_db.expireInSeconds} || ' seconds') < datetime('now')`)
        .limit(1)
        .get();

    if(token === null ||token === undefined) {
        const token = await db.select()
            .from(tokens_db)
            .limit(1)
            .get()


        if(token === null || token === undefined)
            return await getNewToken()
        else
            return await refreshToken(token.refresh_token, token.id)
    };
    return token


}

module.exports = { getTokens };