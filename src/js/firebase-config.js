// src/js/firebase-config.js

import firebase from 'firebase/compat/app';
import 'firebase/compat/messaging';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_apiKey,
    authDomain: "abuelos-43796.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_projectId,
    storageBucket: "abuelos-43796.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_messagingSenderId,
    appId: import.meta.env.VITE_FIREBASE_appId
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const VAPID_KEY = import.meta.env.VITE_FIREBASE_vapidKey;
export const messaging = firebase.messaging();
export const configParaSW = firebaseConfig; 
