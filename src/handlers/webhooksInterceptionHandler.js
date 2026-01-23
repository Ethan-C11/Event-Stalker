const {detailsDataTreatment} = require("./detailsDataTreatment");
const {detailsEmbedBuilder} = require("../utils/detailsEmbedBuilder");
const {stalker_webhooks_table} = require("../../db/schema");
const {db} = require("../../config");
const {eq} = require("drizzle-orm");

async function webhooksInterceptionHandler(body) {
    const embed =  detailsEmbedBuilder(body.data);

    const relevantWebhooks = await db.select()
        .from(stalker_webhooks_table)
        .where(eq(stalker_webhooks_table.organizationSlug, body.data.organizationSlug ));

    console.log(relevantWebhooks);
}

module.exports = { webhooksInterceptionHandler };

 /**
  * Exemple de JSON : {
  *     "data": {}
  *     "eventType" : "Form"
  * }
  */