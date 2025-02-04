const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3000;

// Ruta para recibir mensajes de WhatsApp
app.post('/webhook', (req, res) => {
    const message = req.body.message;
    if (!message) {
        return res.sendStatus(400);
    }

    // Aquí puedes agregar lógica para procesar el mensaje y responder
    const responseMessage = `Tu has dicho: ${message}`;

    axios.post(`https://graph.facebook.com/v12.0/me/messages`, {
        recipient: { id: req.body.senderId },
        message: { text: responseMessage }
    }, {
        headers: { 'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}` }
    }).then(response => {
        res.sendStatus(200);
    }).catch(error => {
        console.error('Error al enviar mensaje a WhatsApp:', error);
        res.sendStatus(500);
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});