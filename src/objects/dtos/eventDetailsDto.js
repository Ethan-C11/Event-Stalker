class EventDetailsDTO {
    constructor(data) {
        this.title = data.title ?? 'Événement sans titre';
        this.description = data.description ?? 'Aucune description';
        this.type = data.activityType ?? 'Événement';

        this.startDate = data.startDate ? new Date(data.startDate).toLocaleString() : undefined;
        this.endDate = data.endDate ? new Date(data.endDate).toLocaleString() : undefined;

        this.organizationName = data.organizationName ?? this.formatSlug(data.organizationSlug);

        this.location = data.place ? {
            name: data.place.name,
            fullAddress: `${data.place.address}, ${data.place.zipCode} ${data.place.city}`,
            city: data.place.city
        } : null;

        this.tiers = (data.tiers || []).map(t => ({
            label: t.label,
            price: `${(t.price / 100).toFixed(2)} ${data.currency === 'EUR' ? '€' : data.currency}`
        }));

        this.url = data.url;
        this.thumbnail = data.widgetVignetteVerticalUrl;
        this.createdAt = data.meta?.createdAt ? new Date(data.meta.createdAt) : new Date();
    }

    get firstPrice() {
        return this.tiers.length > 0 ? this.tiers[0].price : "Gratuit / NC";
    }

    get allPricesFormatted() {
        if (this.tiers.length === 0) return "Gratuit / Non renseigné";

        return this.tiers
            .map(t => {

                const isFree = t.price.startsWith("0.00");
                const displayPrice = isFree ? "Gratuit" : t.price;

                return `**${t.label}** : ${displayPrice}`;
            })
            .join('\n');
    }
}

module.exports = EventDetailsDTO;