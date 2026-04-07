const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuOptionBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { db } = require("../../../config");
const { stalker_webhooks_table } = require("../../../db/schema");
const { eq } = require("drizzle-orm");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-helloasso-webhook')
        .setDescription("Supprime un webhook du serveur, le choix se fait à l'éxecution de la commande")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageWebhooks),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        try {
            const relevantWebhooks = await db.select()
                .from(stalker_webhooks_table)
                .where(eq(stalker_webhooks_table.guildId, interaction.guildId));

            if (relevantWebhooks.length === 0)
                return interaction.editReply(`Il n'y a pas de webhooks Event Stalker sur ce serveur`);

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('delete_ha_webhook')
                .setPlaceholder('Sélectionnez le webhook à supprimer')
                .addOptions(
                    relevantWebhooks.map(webhook =>
                        new StringSelectMenuOptionBuilder()
                            .setLabel(webhook.organizationSlug)
                            .setDescription(`ID interne: ${webhook.id}`)
                            .setValue(webhook.id.toString())
                    )
                );

            const cancelButton = new ButtonBuilder()
                .setCustomId('cancel_delete')
                .setLabel('Annuler')
                .setStyle(ButtonStyle.Secondary);

            const rowSelect = new ActionRowBuilder().addComponents(selectMenu);
            const rowBtn = new ActionRowBuilder().addComponents(cancelButton);

            const response = await interaction.editReply({
                content: "Quel webhook HelloAsso souhaitez-vous supprimer ?",
                components: [rowSelect, rowBtn],
            });

            const confirmation = await response.awaitMessageComponent({
                filter: i => i.user.id === interaction.user.id,
                time: 60_000
            });

            if (confirmation.customId === 'cancel_delete') {
                return await confirmation.update({
                    content: "Suppression annulée.",
                    components: []
                });
            }

            const dbId = parseInt(confirmation.values[0]);
            const webhookData = relevantWebhooks.find(w => w.id === dbId);

            if (webhookData) {
                try {
                    const discordWebhook = await interaction.client.fetchWebhook(webhookData.webhookId, webhookData.webhookToken);
                    await discordWebhook.delete();
                } catch (e) {
                    console.error("Webhook Discord introuvable, suppression DB uniquement.");
                }

                await db.delete(stalker_webhooks_table)
                    .where(eq(stalker_webhooks_table.id, dbId));

                await confirmation.update({
                    content: `✅ Le webhook pour **${webhookData.organizationSlug}** a été supprimé.`,
                    components: []
                });
            }

        } catch (error) {
            if (error.code === 'InteractionCollectorError') {
                return interaction.editReply({ content: 'Temps écoulé, opération annulée.', components: [] });
            }
            console.error(error);
            return interaction.editReply(`Une erreur est survenue lors de la suppression.`);
        }
    },
};