const CACHE_NAME = 'v1';

self.addEventListener('install', function (event) {
    console.log('service worker installed');
});

self.addEventListener('activate', function (event) {
    console.log('service worker activated');

    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            );
        })
    )
});

self.addEventListener('fetch', function (event) {
    console.log('service worker - fetch');

    event.respondWith(
        fetch(event.request).then(fetchRes => {
            return caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request.url, fetchRes.clone());
                return fetchRes;
            })
        }).catch(() => {
            return caches.match(event.request).then(cacheRes => {
                return cacheRes;
            })
        })
    );
});

self.addEventListener('message', function (event) {
    if (event.data.type === 'push-notifications') {
        setTimeout(function () {
            const { title, body } = event.data;
            self.registration.showNotification(title, { body, icon: './icon.png' });
        }, 5000);
    }
});