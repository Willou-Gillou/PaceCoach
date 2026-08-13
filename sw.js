const CACHE_NAME = 'pacecoach-v1.9';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(APP_SHELL);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
        return Promise.resolve();
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

/* Ne met en cache et n'intercepte QUE les fichiers de l'app elle-meme
   (meme origine : index.html, manifest.json, icones). Les tuiles de
   carte OpenStreetMap et la librairie Leaflet, chargees depuis des
   domaines externes, ne passent plus du tout par ce service worker :
   le navigateur les gere directement avec son propre cache HTTP natif,
   deja optimise et borne en taille. Cela evite une accumulation non
   controlee de donnees (potentiellement des centaines de tuiles par
   sortie de course) qui pouvait mettre l'app sous pression memoire et
   provoquer un redemarrage silencieux de la page par Safari - cause
   probable du popup "Retablir la saisie". */
self.addEventListener('fetch', function (event) {
  var req = event.request;

  if (req.method !== 'GET') {
    return;
  }

  var url = new URL(req.url);
  var sameOrigin = (url.origin === self.location.origin);

  if (!sameOrigin) {
    return;
  }

  event.respondWith(
    fetch(req).then(function (response) {
      var copy = response.clone();
      caches.open(CACHE_NAME).then(function (cache) {
        cache.put(req, copy);
      });
      return response;
    }).catch(function () {
      return caches.match(req).then(function (cached) {
        return cached || caches.match('./index.html');
      });
    })
  );
});
