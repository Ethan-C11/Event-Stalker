const {EmbedBuilder} = require("discord.js");
const EventDetailsDTO = require("../objects/dtos/eventDetailsDto");
const {helloAssoUrl} = require("../../config");
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

function detailsEmbedBuilder(jsonBody) {
    const event = new EventDetailsDTO(jsonBody);
    const inputFormat = "DD/MM/YYYY HH:mm:ss";

    const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const d = dayjs(dateStr, inputFormat);
        return d.isValid() ? d : null;
    };

    const startDate = parseDate(event.startDate);
    const endDate =  parseDate(event.endDate);
    const displayDate = () => {
        const outputFormat = "DD/MM/YYYY [-] HH:mm";
        if (startDate && endDate)
            return `du ${startDate.format(outputFormat)} au ${endDate.format(outputFormat)}`;
        else if (startDate && !endDate)
            return `${startDate.format(outputFormat)}`
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
       .setFooter({ text: "Event Stalker • Evenements" })
       .setColor("#00ff55")
        .setTimestamp(event.createdAt);
}

module.exports = { detailsEmbedBuilder };