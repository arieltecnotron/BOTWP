//
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// Variables de entorno (cargar desde Railway o .env)
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "tecnobot2024verify";
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// Verificación del Webhook de Meta
app.get("/webhook", (req, res) => {
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("WEBHOOK VERIFICADO");
        return res.status(200).send(challenge);
    } else {
        console.error("Verificación fallida");
        return res.sendStatus(403);
    }
});

// Manejo de mensajes entrantes
app.post("/webhook", async (req, res) => {
    try {
        let body = req.body;

        if (body.object && body.entry) {
            let entry = body.entry[0];
            let changes = entry.changes[0].value;
            
            if (changes.messages) {
                let message = changes.messages[0];
                let phoneNumber = message.from;
                let text = message.text?.body || "Mensaje sin texto";

                console.log(`📩 Mensaje recibido: "${text}" de ${phoneNumber}`);

                // Enviar respuesta automática
                await axios.post(`https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`, {
                    messaging_product: "whatsapp",
                    to: phoneNumber,
                    type: "text",
                    text: { body: `🤖 Recibí tu mensaje: "${text}"` }
                }, {
                    headers: { Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}` }
                });

                console.log("✅ Respuesta enviada correctamente");
            }

            res.sendStatus(200);
        } else {
            console.warn("⚠️ Webhook recibido sin datos esperados");
            res.sendStatus(400);
        }
    } catch (error) {
        console.error("❌ Error en webhook:", error.response?.data || error.message);
        res.sendStatus(500);
    }
});

// Iniciar servidor en Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor activo en puerto ${PORT}`));

