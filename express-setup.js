const {webhooksInterceptionHandler} = require("./src/handlers/webhooksInterceptionHandler");

function expressSetup() {
    const express = require("express")
    const bodyParser = require("body-parser")
    const app = express()
    const PORT = 4001 // ngrok http 4001
    app.use(bodyParser.json())

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))

    app.get("/", (req, res) => {
        res.send("Serveur en ligne !");
    });

    app.post("/hook", (req, res) => {
        webhooksInterceptionHandler(req.body)
        res.status(200).json("Message reçu").end()
    })

}

module.exports = { expressSetup }