const fs = require('fs');
const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('feedback')
        .setDescription('Renvoie un lien vers la page "Issues" du repo github'),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });


        const embed = new EmbedBuilder()
            .setAuthor({
                name: "Event Stalker",
                iconURL: "https://i.imgur.com/soSow0B.png",
            })
            .setTitle("🪢 Liens vers la page Issues")
            .setURL("https://github.com/Ethan-C11/Event-Stalker/issues")
            .setDescription("Voici un lien vers la page Issues du github où vous pouvez signaler un bug, proposer une suggestions ou demander de l'aide")
            .addFields(
                {name: "🪢 Lien vers la page :", value: "https://github.com/Ethan-C11/Event-Stalker/issues" , inline: false},
            )
            .setColor("#883400")
            .setFooter({text: "Event Stalker • Aide"})
            .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
    }
};