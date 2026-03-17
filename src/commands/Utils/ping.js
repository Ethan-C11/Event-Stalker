const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Réponds avec 'pong', permettant de vérifier le status du bot"),
    
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};