// public/service-worker.js
self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
  });
  
  self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
  });
  
  self.addEventListener('fetch', (event) => {
    console.log('Service Worker fetching:', event.request.url);
    event.respondWith(
      fetch(event.request).catch(() => new Response('Offline'))
    );
  });
  