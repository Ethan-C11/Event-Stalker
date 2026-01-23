const {detailsDataTreatment} = require("./detailsDataTreatment");
const {detailsEmbedBuilder} = require("./detailsEmbedBuilder");

async function webhooksInterceptionHandler(body) {
    const embed =  detailsEmbedBuilder(body.data);
    console.log(embed)

}

module.exports = { webhooksInterceptionHandler };

 /**
  * Exemple de JSON : {
  *     "data": {}
  *     "eventType" : "Form"
  * }
  */