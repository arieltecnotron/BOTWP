// prueba git
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Verificación del Webhook de Meta
app.get("/webhook", (req, res) => {
    const VERIFY_TOKEN = "tecnobot2024verify";

    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token === VERIFY_TOKEN) {
        console.log("WEBHOOK VERIFICADO");
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// Manejo de mensajes entrantes
app.post("/webhook", (req, res) => {
    let body = req.body;

    console.log("Mensaje recibido:", JSON.stringify(body, null, 2));

    res.sendStatus(200);
});

// Iniciar servidor en Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
