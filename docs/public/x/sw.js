// Unregisters itself and clears the caches left by previous service workers.
// See https://developer.chrome.com/docs/workbox/remove-buggy-service-workers/
globalThis.addEventListener('install', () => {
  globalThis.skipWaiting();
});

globalThis.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await globalThis.caches.keys();
      await Promise.all(keys.map((key) => globalThis.caches.delete(key)));
      await globalThis.registration.unregister();
    })(),
  );
});
