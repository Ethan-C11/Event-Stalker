const { SlashCommandBuilder } = require('discord.js');
const {eventDataTreatmentService} = require("../../services/eventDataTreatmentService");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fetch-events-details')
        .setDescription("Affiche les détails d'un évènement.")
        .addStringOption((option) =>
            option.setName('organization-slug')
                .setDescription("le Slug de l'association, disponible dans l'url après '/associations/'")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('event-slug')
                .setDescription("Le slug de l'évènement, disponible dans l'url après '/evenements/'")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply();
        const organizationSlug = interaction.options.getString('organization-slug');
        const eventSlug = interaction.options.getString('event-slug');

        const treatedDataEmbed = await eventDataTreatmentService(organizationSlug, eventSlug);
        return interaction.editReply({ embeds: [treatedDataEmbed] });
    },
};