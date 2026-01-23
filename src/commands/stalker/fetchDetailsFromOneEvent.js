const { getTokens } = require("../../handlers/api-auth/helloAssoAuth");
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const EventDetailsDTO = require("../../objects/dtos/eventDetailsDto");
const {helloAssoUrl} = require("../../../config");
const {detailsDataTreatment} = require("../../handlers/detailsDataTreatment");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fetch-events-details')
        .setDescription('Fetch details from one event')
        .addStringOption((option) =>
            option.setName('organization-slug')
                .setDescription("Slug of your organization")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('event-slug')
                .setDescription("Slug of your event")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply();
        const organizationSlug = interaction.options.getString('organization-slug');
        const eventSlug = interaction.options.getString('event-slug');

        const treatedDataEmbed = await detailsDataTreatment(organizationSlug, eventSlug);

        return interaction.editReply({ embeds: [treatedDataEmbed] });
    },
};