self.addEventListener('install', e => {
    e.waitUntil(
        caches.open('static')
            .then(cache => {
                return cache.addAll([
                    'index.html',
                    'css/style.css',
                    'img/logo_192.png'
                ])
            })
    );
})