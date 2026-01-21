const { getTokens } = require("../../handlers/api-auth/helloAssoAuth");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check-hello-asso')
        .setDescription('Check the status of HelloAsso'),
    async execute(interaction) {
        const callApi = await getTokens()
        if (callApi) return interaction.reply("HelloAsso est OK")
        else return interaction.reply("HelloAsso est KO")
    },
};