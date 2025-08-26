self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open('pool-v1').then(c=>c.addAll([
    './','./index.html','./app.js','./icons/icon-192.png','./icons/icon-512.png'
  ])));
});
self.addEventListener('fetch', (e)=>{
  e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)));
});