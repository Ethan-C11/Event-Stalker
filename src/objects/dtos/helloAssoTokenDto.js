class HelloAssoTokenDto {
    /**
     * @param {string} grant_type
     * @param {string} client_id
     * @param {string} client_secret
     */
    constructor(grant_type, client_id, client_secret) {
        this.grant_type = grant_type;
        this.client_id = client_id;
        this.client_secret = client_secret;
    }
}

// Exportation pour CommonJS
module.exports = { HelloAssoTokenDto };