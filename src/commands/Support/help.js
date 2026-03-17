const fs = require('fs');
const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Affichage et description des commandes'),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const commandsPath = path.join(process.cwd(), 'src', 'commands');
        const commandFolders = fs.readdirSync(commandsPath);

        const fields = [];

        for (const category of commandFolders) {
            const categoryPath = path.join(commandsPath, category);

            if (!fs.lstatSync(categoryPath).isDirectory()) continue;

            const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));

            let commandList = "";
            for (const file of commandFiles) {
                const filePath = path.join(categoryPath, file);
                const command = require(filePath);

                if (command.data) {
                    commandList += `**/${command.data.name}**: ${command.data.description}\n`;
                }
            }

            if (commandList.length > 0) {
                fields.push({
                    name: `📁 ${category.toUpperCase()}`,
                    value: commandList,
                    inline: false
                });
            }
        }

        const embed = new EmbedBuilder()
            .setAuthor({
                name: "Event Stalker",
                iconURL: "https://i.imgur.com/soSow0B.png",
            })
            .setTitle("📚 Liste des commandes")
            .setDescription("Voici toutes les commandes disponibles triées par catégorie.")
            .addFields(fields)
            .setColor("#883400")
            .setFooter({ text: "Event Stalker • Aide" })
            .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
    }
};