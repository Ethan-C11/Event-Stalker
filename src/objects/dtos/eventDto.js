class EventDTO {
    constructor(data) {
        this.title = data.title;
        this.organizationSlug = data.organizationSlug;
        this.description = data.description;
        this.url = data.url;
        this.formSlug = data.formSlug;
        this.startDate = this.formatIsoDate(data.startDate);
        this.endDate = this.formatIsoDate(data.endDate);
    }

    formatIsoDate(isoString) {
        if (!isoString) return null;

        const date = new Date(isoString);
        if (isNaN(date.getTime())) return null;

        const pad = (n) => n.toString().padStart(2, '0');

        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1);
        const year = date.getFullYear();
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());

        return `${day}/${month}/${year} - ${hours}:${minutes}`;
    }
}
module.exports = EventDTO;