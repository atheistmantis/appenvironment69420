const CACHE = 'phone-app-v1';

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE).then(cache => {
      const base = self.registration.scope;
      return cache.addAll([
        base,
        base + 'index.html',
        // add icons and other assets you want cached
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(r => r || fetch(evt.request))
  );
});