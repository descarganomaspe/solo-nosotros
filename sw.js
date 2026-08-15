var CACHE = 'app-v2';
// Red primero: si hay internet siempre se ve la version mas nueva;
// si no hay, se sirve la copia guardada.
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.map(function(k){ if (k !== CACHE) return caches.delete(k); }));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function(e){
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function(resp){
      var copia = resp.clone();
      caches.open(CACHE).then(function(c){ try { c.put(e.request, copia); } catch(err){} });
      return resp;
    }).catch(function(){ return caches.match(e.request); })
  );
});
