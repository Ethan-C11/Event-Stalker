const { getTokens } = require("../../handlers/api-auth/helloAssoAuth");
const { SlashCommandBuilder } = require('discord.js');
const { HELLOASSO_URL} = process.env;


module.exports = {
    data: new SlashCommandBuilder()
        .setName('fetch-events-helloasso')
        .setDescription('Fetch all active and public event from one HelloAsso association')
        .addStringOption((option) =>
            option.setName('assocation-slug')
                .setDescription("Slug of your association (ex: https://www.helloasso.com/associations/this-is-your-slug)")
                .setRequired(true)
        ),

    async execute(interaction) {
        const {access_token, refresh_token, token_type} = await getTokens()
        const slug = interaction.options.getString('assocation-slug')

        const url = HELLOASSO_URL + `/v5/organizations/${slug}/forms?formTypes=Event&states=Public&pageIndex=1&pageSize=20`;

        const options = {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${access_token}` // Injection du token ici
            }
        };

        const res = await fetch(url, options)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Erreur HTTP: ${res.status}`);
                }
                return res.json();
            })
            .then(json => {
                console.log(json.data)
                return json.data
            })
            .catch(err => console.error('Erreur lors de la requête :', err));
        console.log(res)
        return interaction.reply(JSON.stringify(res[0], null, 2))
    },
};