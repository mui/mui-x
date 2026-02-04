// https://github.com/airbnb/javascript/issues/1632

// See https://developer.chrome.com/docs/workbox/remove-buggy-service-workers/
globalThis.addEventListener('install', () => {
  // Skip over the "waiting" lifecycle state, to ensure that our
  // new service worker is activated immediately, even if there's
  // another tab open controlled by our older service worker code.
  globalThis.skipWaiting();
});
globalThis.addEventListener('message', () => {
  // Optional: Get a list of all the current open windows/tabs under
  // our service worker's control, and force them to reload.
  // This can "unbreak" any open windows/tabs as soon as the new
  // service worker activates, rather than users having to manually reload.
  globalThis.clients.matchAll({ type: 'window' }).then((windowClients) => {
    windowClients.forEach((windowClient) => {
      windowClient.navigate(windowClient.url);
    });
  });
});
