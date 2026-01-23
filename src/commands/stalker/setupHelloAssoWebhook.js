const { getTokens } = require("../../handlers/api-auth/helloAssoAuth");
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const {db} = require("../../../config");
const {stalker_webhooks_table} = require("../../../db/schema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-helloasso-webhook')
        .setDescription('Fetch all active and public events from one HelloAsso association')
        .addStringOption((option) =>
            option.setName('organization-slug') // Correction typo: association
                .setDescription("Slug of your organization")
                .setRequired(true)
        )
        .addChannelOption((option) =>
            option.setName('target-channel')
                .setDescription("Channel in which you want your alert to be sent to")
                .setRequired(true)
    ),

    async execute(interaction) {
        await interaction.deferReply();

        try {
            const tokens = await getTokens();
            if (!tokens || !tokens.access_token) {
                return interaction.editReply("Impossible de récupérer le token d'accès HelloAsso.");
            }

            const organizationSlug = interaction.options.getString('organization-slug');
            const targetChannel = interaction.options.getChannel('target-channel');
            targetChannel.createWebhook({
                name: `Event Stalker ${organizationSlug}`,
                avatar : 'https://i.imgur.com/soSow0B.png'
            }).then( async (webhook) => {
                const token = webhook.token;
                const id = webhook.id.toString();
                const guildId = webhook.guildId.toString();

                console.log(await db.insert(stalker_webhooks_table).values({
                    organizationSlug: organizationSlug,
                    webhookId: id,
                    webhookToken: token,
                    guildId: guildId,
                }));

                return interaction.editReply({content: "Webhook créé"})
            }).catch((error) => {
                return interaction.editReply(`Une erreur est survenue : ${error.message}`);
            })


        } catch (error) {
            console.error(error);
            return interaction.editReply(`Une erreur est survenue : ${error.message}`);
        }
    },
};