/* Un solo service worker: cachea el cascarón de la PWA Y recibe las
   notificaciones push de Firebase Messaging en segundo plano. */
importScripts('https://www.gstatic.com/firebasejs/12.18.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.18.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCCg3W3aRPiV5MWdeiXN43qYl6lVqcd7LQ",
  authDomain: "calendario-institucional-1a58e.firebaseapp.com",
  projectId: "calendario-institucional-1a58e",
  storageBucket: "calendario-institucional-1a58e.firebasestorage.app",
  messagingSenderId: "71725178168",
  appId: "1:71725178168:web:8c6a2d9a12ee479eb9b5cd"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const titulo = (payload.notification && payload.notification.title) || 'Calendario escolar';
  const cuerpo = (payload.notification && payload.notification.body) || '';
  self.registration.showNotification(titulo, {
    body: cuerpo,
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-192.png',
  });
});

/* ---------- cache del cascarón de la app (para que funcione instalada) ---------- */
const CACHE = 'calendario-escolar-v2';
const SHELL = ['/', '/index.html', '/manifest.json', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (SHELL.includes(url.pathname)) {
    e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
  }
});
