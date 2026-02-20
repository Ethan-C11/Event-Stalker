const {EmbedBuilder} = require("discord.js");
const EventDetailsDTO = require("../objects/dtos/eventDetailsDto");
const {helloAssoUrl} = require("../../config");

function detailsEmbedBuilder(jsonBody) {
    const event = new EventDetailsDTO(jsonBody);
    const startDate = event.startDate?.toLocaleString() || undefined;
    const endDate = event.endDate?.toLocaleString() || undefined;

    console.log(jsonBody);

    const displayDate = () => {
        if (startDate && endDate)
            return `${startDate} à ${endDate}`;
        else if (startDate && !endDate)
            return `${startDate}`
        else
            return "Non précisé"
    }

    const formattedLocation = () => {
        if(event.location !== undefined)
            return event.location?.fullAddress;
        else if (event.place !== undefined)
            return (`${event.place.name }, ${event.place.address}, ${event.place.city} ${event.place.zipCode}, ${event.place.country}`)
        else
            return "Non spécifié";
    }

   return new EmbedBuilder()
        .setAuthor({
            name: event.organizationName,
            url: `${helloAssoUrl}/associations/${event.organizationSlug}/`,
            iconURL: "https://i.imgur.com/soSow0B.png",
        })
        .setTitle(event.title)
        .setURL(event.url)
        .setDescription(event.description || "Pas de description")
        .setThumbnail(event.thumbnail || "../images/default-thumbnail.png")
        .addFields(
            {name: '📍 Lieu', value: formattedLocation() || 'Non spécifié', inline: false},
            {name: '💰 Tarif(s)', value: event.allPricesFormatted, inline: false},
            {name: '📆 Date', value: displayDate(), inline: false},
            {name: "🪢 Lien vers l'évènement :", value: event.url, inline: false},
        )
        .setColor("#00ff55")
        .setTimestamp(event.createdAt);
}

module.exports = { detailsEmbedBuilder };