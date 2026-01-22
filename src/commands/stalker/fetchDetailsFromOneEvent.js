const { getTokens } = require("../../handlers/api-auth/helloAssoAuth");
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const EventDetailsDTO = require("../../objects/dtos/eventDetailsDto");
const {helloAssoUrl} = require("../../../config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fetch-events-details')
        .setDescription('Fetch details from one event')
        .addStringOption((option) =>
            option.setName('association-slug') // Correction typo: association
                .setDescription("Slug of your association")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('event-slug') // Correction typo: association
                .setDescription("Slug of your event")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply();

        try {
            const tokens = await getTokens();
            if (!tokens || !tokens.access_token) {
                return interaction.editReply("Impossible de récupérer le token d'accès HelloAsso.");
            }

            const associationSlug = interaction.options.getString('association-slug');
            const eventSlug = interaction.options.getString('event-slug');
            const url = `${helloAssoUrl}/v5/organizations/${associationSlug}/forms/Event/${eventSlug}/public`;

            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${tokens.access_token}`
                }
            });

            if (!res.ok) throw new Error(`Erreur HTTP HelloAsso: ${res.status}`);

            const jsonBody = await res.json();
            console.log(jsonBody);

            const event = new EventDetailsDTO(jsonBody);
            const startDate = event.startDate.toLocaleString();
            const endDate = event.endDate.toLocaleString();

            const displayDate = () => {
                if(startDate && endDate)
                    return `${startDate} à ${endDate}`;
                else if(startDate && !endDate)
                    return `${startDate}`
                else
                    return "Non précisé"
            }


            const embed = new EmbedBuilder()
                .setAuthor({ name: event.organizationName,
                    iconURL: "https://i.imgur.com/soSow0B.png",
                })
                .setTitle(event.title)
                .setURL(event.url)
                .setDescription(event.description)
                .setThumbnail(event.thumbnail)
                .addFields(
                    { name: '📍 Lieu', value: event.location?.fullAddress || 'Non spécifié', inline: false },
                    { name: '💰 Tarif(s)', value: event.allPricesFormatted, inline: false },
                    { name: '📆 Date', value: displayDate(), inline: false },
                    { name: '🏷️ Type', value: event.type, inline: true },
                    { name: "🪢 Lien vers l'évènement :", value: event.url, inline: false},
                )
                .setColor("#00ff55")
                .setTimestamp(event.createdAt);

            return interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            return interaction.editReply(`Erreur : ${error.message}`);
        }
    },
};