import { VAPID_KEY } from "./js/firebase-config";
import { messaging } from './js/firebase-config';
const SERVER_IP = 'https://abuelos.onrender.com'; // 

window.toggleVisibility = function() {
    const simple = document.getElementById('simple');
    const debug = document.getElementById('debug');
    simple.classList.toggle('hidden');
    debug.classList.toggle('hidden');
};

let swRegistration;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        const config = {
            apiKey: import.meta.env.VITE_FIREBASE_apiKey,
            messagingSenderId: import.meta.env.VITE_FIREBASE_messagingSenderId,
            appId: import.meta.env.VITE_FIREBASE_appId,
            projectId: import.meta.env.VITE_FIREBASE_projectId,
        };

        const configParam = encodeURIComponent(JSON.stringify(config));
        swRegistration = await navigator.serviceWorker.register(
            `/firebase-messaging-sw.js?config=${configParam}`
        );
    });
}

async function getToken() {
	const btn = document.getElementById('btn-permisos');
	const btnText = document.getElementById('btn-text');
	const notificationStatus = document.getElementById('notification-status');
	const deviceName = document.getElementById('device-name');
	const tokenStatus = document.getElementById('token-status');
	const tokenDisplay = document.getElementById('token-display');
	const textSimple = document.getElementById('text-simple');
	const iconSimple = document.getElementById('icon-simple');

	btn.classList.add('loading');
	btnText.innerText = "Procesando...";
	tokenDisplay.innerText = "Generando credenciales...";

	const device = navigator?.userAgentData?.platform || navigator?.platform;
	deviceName.innerText = device

	try {
		const permission = await Notification.requestPermission();
		if (permission === 'granted') {
			notificationStatus.innerText = "Activadas"
			const token = await messaging.getToken({ 
				vapidKey: VAPID_KEY,
				serviceWorkerRegistration: swRegistration
			});

			if (token) {
				tokenDisplay.innerText = token;
				tokenStatus.innerText = "Registrado";
				btnText.innerText = "Registrando...";

				textSimple.innerHTML = '<h2 style="color:green;"> App corriendo! </h2>'
				iconSimple.innerHTML = '<img src="/img/icon-192.png"></img>'
				const response = await fetch(`${SERVER_IP}/register-token`, {
					method: 'POST',
					mode: 'cors',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: device,
						token: token 
					})
				});

				if (response.ok) {
					btnText.innerText = "¡Listo!";
					btn.disabled = true; 
					btn.classList.add('success');
				} else {
					throw new Error("Error en el servidor");
				}
			} else {
				alert("No se pudo obtener el token.");
			}
		} else {
			alert("No diste permiso para las notificaciones.");
		}
	} catch (error) {
		console.error(error);
		alert("Ocurrió un error: " + error.message);
		btnText.innerText = "Reintentar";
	} finally {
		btn.classList.remove('loading');
		if (btnText.innerText === "Procesando...") {
			btnText.innerText = "Habilitar Notificaciones";
		}
	}
}

getToken()
