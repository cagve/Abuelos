importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const urlParams = new URLSearchParams(location.search);
const configString = urlParams.get('config');

if (configString) {
    try {
        const firebaseConfig = JSON.parse(decodeURIComponent(configString));

        firebase.initializeApp(firebaseConfig);
        const messaging = firebase.messaging();

        // 4. Manejador de notificaciones en segundo plano
        messaging.onBackgroundMessage((payload) => {
            console.log('[sw.js] Mensaje recibido:', payload);
            
            const notificationTitle = payload.notification.title || "Nueva notificación";
            const notificationOptions = {
                body: payload.notification.body,
                icon: '/favicon.ico', // Ajusta según tus assets en public
                badge: '/favicon.ico'
            };

            self.registration.showNotification(notificationTitle, notificationOptions);
        });

    } catch (error) {
        console.error('[sw.js] Error al parsear la configuración de Firebase:', error);
    }
} else {
    console.error('[sw.js] No se encontró la configuración en la URL de registro.');
}
