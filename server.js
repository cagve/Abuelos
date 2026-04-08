const admin = require('firebase-admin');
const path = require('path');
const cors = require('cors');
const serviceAccount = require('./abuelos-43796-firebase-adminsdk-fbsvc-91139a3fcc.json');
const express = require('express')
const app = express()
const port = 3000
const url = '127.0.0.1'


admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

const sendNotification = async (user, title, body) => {
	const message = {
        data: {
            title: title,
            body: body,
            icon: url + '/img/grandparent.jpg'
        },
        webpush: {
            headers: { Urgency: 'high' },
            notification: {
                title: title, 
                body: body,
                icon: url + '/img/grandparent.jpg',
                image: url + '/img/grandparent.jpg',
                badge: url + '/img/badge-silueta.png',
                vibrate: [500, 100, 500],
                tag: 'alerta-abuelo',
                renotify: true,
                requireInteraction: true
            }
        },
				android: {
					priority: 'high',
				},
        token: user.token
    };

	try {
		const response = await admin.messaging().send(message);
		console.log('Notificación enviada con éxito:', response);
	} catch (error) {
		console.log('Error enviando notificación:', error);
	}
};

app.use(cors());
app.use(express.json());

let users = [];
let storedUser = null

// Endpoint para que el cliente registre su token
app.post('/register-token', (req, res) => {
	const { name, token } = req.body;
	const tokenExists = users.find(u => u.token === token);

	if (tokenExists) {
		return res.send('User ya registrado')
	}

	storedUser = { name, token }
	users.push(storedUser);

	console.log("User registrado: ")
	console.log("	Name: " + storedUser.name)
	console.log("	Token: " + storedUser.token)
	res.send('User registrado con éxito');
});


app.get('/test-push', async (req, res) => {
	if (!storedUser) return res.status(400).send("No hay user registrado");
	await sendNotification(storedUser, "¡Hola!", "Esta es una prueba de Firebase.");
	res.send('Notificación enviada');
});

app.get('/api/all-tokens', (req, res) => {
	res.json(users);
});


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

