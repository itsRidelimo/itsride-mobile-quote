const CACHE='itsride-quote-v1-5';
const ASSETS=['./','./index.html','./config.js','./logo.png','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(event.request.mode==='navigate'||url.pathname.endsWith('/index.html')){
   event.respondWith(fetch(event.request).then(resp=>{const clone=resp.clone();caches.open(CACHE).then(c=>c.put('./index.html',clone));return resp;}).catch(()=>caches.match('./index.html').then(r=>r||caches.match('./'))));
   return;
 }
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(resp=>{if(url.origin===self.location.origin){const clone=resp.clone();caches.open(CACHE).then(c=>c.put(event.request,clone));}return resp;})));
});
