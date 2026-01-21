const { getTokens } = require("../../handlers/api-auth/helloAssoAuth");
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const EventDTO = require("../../objects/dtos/eventDto");
require('dotenv').config();
const { HELLOASSO_URL } = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fetch-events-helloasso')
        .setDescription('Fetch all active and public events from one HelloAsso association')
        .addStringOption((option) =>
            option.setName('association-slug') // Correction typo: association
                .setDescription("Slug of your association")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply();

        try {
            const tokens = await getTokens();
            if (!tokens || !tokens.access_token) {
                return interaction.editReply("Impossible de récupérer le token d'accès HelloAsso.");
            }

            const slug = interaction.options.getString('association-slug');
            const url = `${HELLOASSO_URL}/v5/organizations/${slug}/forms?formTypes=Event&states=Public&pageIndex=1&pageSize=20`;

            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${tokens.access_token}`
                }
            });

            if (!res.ok) throw new Error(`Erreur HTTP HelloAsso: ${res.status}`);

            const jsonResponse = await res.json();
            const forms = jsonResponse.data;

            if (!forms || forms.length === 0) {
                return interaction.editReply("Aucun événement public trouvé pour cette association.");
            }

            const embeds = forms.slice(0, 5).map(formData => {
                const event = new EventDTO(formData);

                const formattedSlug = event.organizationSlug
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                return new EmbedBuilder()
                    .setAuthor({
                        name: formattedSlug,
                        iconURL: "https://i.imgur.com/soSow0B.png",
                    })
                    .setTitle(event.title || event.slug) // Utilise le titre du DTO
                    .setURL(event.url)
                    .setDescription(event.description || "Pas de description")
                    .addFields(
                        { name: "Lien vers l'évènement :", value: event.url, inline: false},
                            { name: "Date de création", value: event.meta.createdAt ? event.meta.createdAt.toLocaleString() : "Inconnue", inline: false
                            })
                    .setColor("#00ff55")
                    .setTimestamp();
            });

            return interaction.editReply({ embeds: embeds });

        } catch (error) {
            console.error(error);
            return interaction.editReply(`Une erreur est survenue : ${error.message}`);
        }
    },
};