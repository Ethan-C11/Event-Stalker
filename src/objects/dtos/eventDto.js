class EventDTO {
    constructor(data) {
        this.title = data.title;
        this.organizationSlug = data.organizationSlug;
        this.description = data.description;
        this.url = data.url;
        this.formSlug = data.formSlug;
        this.meta = {
            createdAt: data.meta?.createdAt ? new Date(data.meta.createdAt).toLocaleString() : "Date inconnue"
        };
    }
}
module.exports = EventDTO;