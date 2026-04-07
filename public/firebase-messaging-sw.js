// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const urlParams = new URLSearchParams(location.search);
const configString = urlParams.get('config');

if (configString) {
	const firebaseConfig = JSON.parse(decodeURIComponent(configString));
	firebase.initializeApp(firebaseConfig);
	const messaging = firebase.messaging();

	console.log("SW: Firebase inicializado dinámicamente");
} else {
	console.error("SW: No se recibió la configuración de Firebase");
}
