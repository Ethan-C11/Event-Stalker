if (!process.env.TOKEN) {
    require('dotenv').config();
}

module.exports = {
    token: process.env.TOKEN ,
    clientId: process.env.CLIENT_ID ,
    guildId: process.env.GUILD_ID ,
    helloAssoClientId: process.env.HELLOASSO_CLIENT_ID,
    helloAssoClientSecret: process.env.HELLOASSO_CLIENT_SECRET,
    helloAssoUrl: process.env.HELLOASSO_URL,
    dbFileName: process.env.DB_FILENAME
};