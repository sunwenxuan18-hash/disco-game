'use strict';
const PREFIX='disco-club:'+new URL(self.registration.scope).pathname+':';
const CACHE=PREFIX+'c17ac457fbd8';
const FILES=['./','./index.html','./app.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
  if(request.mode==='navigate')event.respondWith(fetch(request).then(async response=>{if(response.ok){try{const cache=await caches.open(CACHE);await cache.put(request,response.clone());}catch(_){}}return response;}).catch(()=>caches.match(request).then(hit=>hit||caches.match(new URL('./index.html',self.registration.scope).href))));
  else event.respondWith(caches.match(request).then(hit=>hit||fetch(request)));
});
