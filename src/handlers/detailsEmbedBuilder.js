const {EmbedBuilder} = require("discord.js");
const EventDetailsDTO = require("../objects/dtos/eventDetailsDto");
const {helloAssoUrl} = require("../../config");

function detailsEmbedBuilder(jsonBody) {
    const event = new EventDetailsDTO(jsonBody);
    const startDate = event.startDate?.toLocaleString() || undefined;
    const endDate = event.endDate?.toLocaleString() || undefined;

    const displayDate = () => {
        if (startDate && endDate)
            return `${startDate} à ${endDate}`;
        else if (startDate && !endDate)
            return `${startDate}`
        else
            return "Non précisé"
    }

   return new EmbedBuilder()
        .setAuthor({
            name: event.organizationName,
            url: `${helloAssoUrl}/associations/${event.organizationSlug}/`,
            iconURL: "https://i.imgur.com/soSow0B.png",
        })
        .setTitle(event.title)
        .setURL(event.url)
        .setDescription(event.description)
        .setThumbnail(event.thumbnail)
        .addFields(
            {name: '📍 Lieu', value: event.location?.fullAddress || 'Non spécifié', inline: false},
            {name: '💰 Tarif(s)', value: event.allPricesFormatted, inline: false},
            {name: '📆 Date', value: displayDate(), inline: false},
            {name: '🏷️ Type', value: event.type, inline: true},
            {name: "🪢 Lien vers l'évènement :", value: event.url, inline: false},
        )
        .setColor("#00ff55")
        .setTimestamp(event.createdAt);
}

module.exports = { detailsEmbedBuilder };