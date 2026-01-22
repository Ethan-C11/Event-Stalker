import {getTokens} from "./api-auth/helloAssoAuth";
import {helloAssoUrl} from "../../config";
import EventDetailsDTO from "../objects/dtos/eventDetailsDto";

export async function detailsDataTreatment(associationSlug, eventSlug) {
    try {
        const tokens = await getTokens();
        if (!tokens || !tokens.access_token) {
            return interaction.editReply("Impossible de récupérer le token d'accès HelloAsso.");
        }
        const url = `${helloAssoUrl}/v5/organizations/${associationSlug}/forms/Event/${eventSlug}/public`;

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${tokens.access_token}`
            }
        });

        if (!res.ok) throw new Error(`Erreur HTTP HelloAsso: ${res.status}`);

        const jsonBody = await res.json();
        console.log(jsonBody);

        const event = new EventDetailsDTO(jsonBody);
        const startDate = event.startDate.toLocaleString();
        const endDate = event.endDate.toLocaleString();

        const displayDate = () => {
            if (startDate && endDate)
                return `${startDate} à ${endDate}`;
            else if (startDate && !endDate)
                return `${startDate}`
            else
                return "Non précisé"
        }


        const embed = new EmbedBuilder()
            .setAuthor({
                name: event.organizationName,
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

        return embed
    } catch (error) {
    console.error(error);
        throw error;
    }
}