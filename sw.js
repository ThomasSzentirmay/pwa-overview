self.addEventListener('install', e => {

    e.waitUntil(
        caches.open('static')
            .then(cache => {
                return cache.addAll([
                    'index.html',
                    'css/style.css',
                    'img/zentick_logo_192.png'
                ])
            })
    );

});

self.addEventListener('fetch', e => {

    e.respondWith(
        caches.match(e.request).then(cachedRes => {
            console.log(cachedRes);
            return cachedRes || fetch(e.request);
        })
    );
    
});